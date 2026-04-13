################################################################################
# Constellation des Objets — Génération des données
#
# Produit deux fichiers JSON :
#   graph.json       — GRAPH_DAYS derniers jours, nœuds + articles + liens
#                      → Mode Constellation
#   timeseries.json  — HISTORY_DAYS derniers jours, nœuds + articles, sans liens
#                      → Mode Évolution
#
# Usage :
#   source("constellation/build_data.R")
#
# Adrien Cloutier
################################################################################

# ─── Paramètres ────────────────────────────────────────────────────────────────

GRAPH_DAYS       <- 14   # Fenêtre graph.json (constellation)
HISTORY_DAYS     <- 90   # Fenêtre timeseries.json (évolution)
TOP_N_OBJECTS    <- 30   # Nœuds max par période × pays
MIN_COOCCURRENCE <- 1    # Seuil minimum d'URLs partagées pour un lien

# Objets génériques exclus par pays (même logique que radar-hot-20)
EXCLUSION_BY_COUNTRY <- list(
  QC  = c("quebec", "montreal", "canada"),
  USA = c("usa", "united states", "fox news", "cnn", "washington dc"),
  CAN = c("canada", "ottawa")
)

OUT_DIR <- tryCatch({
  dirname(rstudioapi::getSourceEditorContext()$path)
}, error = function(e) {
  args <- commandArgs(trailingOnly = FALSE)
  file_arg <- grep("--file=", args, value = TRUE)
  if (length(file_arg) > 0) {
    dirname(normalizePath(sub("--file=", "", file_arg[1])))
  } else {
    "/Users/adrien/repo_github/radar-plus/constellation"
  }
})

GRAPH_FILE <- file.path(OUT_DIR, "graph.json")
TS_FILE    <- file.path(OUT_DIR, "timeseries.json")
MONITOR_INPUT_FILE <- file.path(OUT_DIR, "monitor_input.json")

# ─── Lecture des CSV produits par fetch_data.py ────────────────────────────────

history_start <- format(Sys.Date() - HISTORY_DAYS, "%Y-%m-%d")
graph_start   <- as.Date(Sys.Date() - GRAPH_DAYS)

cat("Lecture de salient_index...\n")
df_index <- readr::read_csv(file.path(OUT_DIR, "salient_index.csv"),
                            show_col_types = FALSE) |>
  dplyr::mutate(
    date_utc                  = as.Date(date_utc),
    n                         = as.integer(n),
    absolute_normalized_index = as.numeric(absolute_normalized_index)
  ) |>
  dplyr::filter(date_utc >= as.Date(history_start))
cat("  →", nrow(df_index), "lignes chargées\n")

cat("Lecture de salient_headlines_objects (médias)...\n")
df_objects <- readr::read_csv(file.path(OUT_DIR, "salient_objects.csv"),
                              show_col_types = FALSE) |>
  dplyr::mutate(date_utc = as.Date(substr(as.character(headline_stop_utc), 1, 10))) |>
  dplyr::filter(date_utc >= as.Date(history_start))
cat("  →", nrow(df_objects), "lignes médias chargées\n")

# ─── Nœuds : top N par période × pays (toute la fenêtre historique) ───────────

df_nodes <- df_index |>
  dplyr::group_by(country_id, date_utc, time_interval_utc) |>
  dplyr::slice_max(absolute_normalized_index, n = TOP_N_OBJECTS, with_ties = FALSE) |>
  dplyr::ungroup()

df_obj_media <- df_objects |>
  tidyr::separate_rows(extracted_objects, sep = ",") |>
  dplyr::mutate(
    extracted_objects = tolower(trimws(extracted_objects)),
    extracted_objects = stringr::str_remove_all(extracted_objects, "[[:punct:]]")
  ) |>
  dplyr::filter(!is.na(extracted_objects) & extracted_objects != "") |>
  dplyr::group_by(country_id, date_utc, time_interval_utc, extracted_objects) |>
  dplyr::summarise(media_ids = list(sort(unique(as.character(media_id)))), .groups = "drop")

# ─── Liens : co-occurrence (fenêtre graph seulement) ──────────────────────────

df_nodes_graph   <- df_nodes   |> dplyr::filter(date_utc >= graph_start)
df_objects_graph <- df_objects |> dplyr::filter(date_utc >= graph_start)

cat("Calcul des co-occurrences (", GRAPH_DAYS, "derniers jours)...\n")

df_obj_urls <- df_nodes_graph |>
  dplyr::mutate(
    url_list = purrr::map(urls, function(u) {
      tryCatch(jsonlite::fromJSON(u), error = function(e) character(0))
    })
  ) |>
  dplyr::select(country_id, date_utc, time_interval_utc, extracted_objects, url_list) |>
  tidyr::unnest(url_list) |>
  dplyr::rename(url = url_list) |>
  dplyr::filter(!is.na(url) & url != "")

df_edges <- df_obj_urls |>
  dplyr::inner_join(
    df_obj_urls |> dplyr::rename(extracted_objects_b = extracted_objects),
    by = c("country_id", "date_utc", "time_interval_utc", "url"),
    relationship = "many-to-many"
  ) |>
  dplyr::filter(extracted_objects < extracted_objects_b) |>
  dplyr::group_by(country_id, date_utc, time_interval_utc,
                  source = extracted_objects, target = extracted_objects_b) |>
  dplyr::summarise(value = dplyr::n(), .groups = "drop") |>
  dplyr::filter(value >= MIN_COOCCURRENCE)

df_obj_urls_media <- df_objects_graph |>
  dplyr::filter(!is.na(url) & url != "") |>
  tidyr::separate_rows(extracted_objects, sep = ",") |>
  dplyr::mutate(
    extracted_objects = tolower(trimws(extracted_objects)),
    extracted_objects = stringr::str_remove_all(extracted_objects, "[[:punct:]]")
  ) |>
  dplyr::filter(!is.na(extracted_objects) & extracted_objects != "") |>
  dplyr::select(country_id, date_utc, time_interval_utc, media_id, url, extracted_objects)

df_edges_media <- df_obj_urls_media |>
  dplyr::inner_join(
    df_obj_urls_media |> dplyr::rename(extracted_objects_b = extracted_objects),
    by = c("country_id", "date_utc", "time_interval_utc", "url"),
    relationship = "many-to-many"
  ) |>
  dplyr::mutate(media_id = dplyr::coalesce(media_id.x, media_id.y)) |>
  dplyr::filter(extracted_objects < extracted_objects_b) |>
  dplyr::group_by(country_id, date_utc, time_interval_utc,
                  source = extracted_objects, target = extracted_objects_b) |>
  dplyr::summarise(media_ids = list(sort(unique(as.character(media_id)))), .groups = "drop")

cat("  →", nrow(df_edges), "liens calculés\n")

# ─── Helpers ───────────────────────────────────────────────────────────────────

countries <- c("CAN", "QC", "USA")

parse_json_chr <- function(x) {
  if (is.na(x) || !nzchar(x)) return(character(0))
  tryCatch(as.character(jsonlite::fromJSON(x)), error = function(e) character(0))
}

rows_to_records <- function(df) {
  if (nrow(df) == 0) return(list())

  df_safe <- df |>
    dplyr::mutate(
      dplyr::across(tidyselect::where(~ inherits(.x, "Date")), as.character),
      dplyr::across(tidyselect::where(~ inherits(.x, "POSIXt")), as.character)
    )

  purrr::transpose(df_safe)
}

url_to_media <- {
  lkp <- df_objects |>
    dplyr::filter(!is.na(url) & url != "") |>
    dplyr::distinct(url, .keep_all = TRUE) |>
    dplyr::select(url, media_id)
  setNames(as.character(lkp$media_id), lkp$url)
}

build_articles <- function(urls_json, titles_json, max_articles = 15) {
  urls <- parse_json_chr(urls_json)
  if (!length(urls)) return(list())
  titles <- parse_json_chr(titles_json)
  if (!length(titles)) titles <- rep("", length(urls))
  if (length(titles) < length(urls)) titles <- c(titles, rep("", length(urls) - length(titles)))
  seen <- character(0)
  out  <- list()
  for (i in seq_along(urls)) {
    u <- urls[i]
    if (is.na(u) || !nzchar(u) || u %in% seen) next
    seen <- c(seen, u)
    title_i <- trimws(titles[i])
    media_i <- url_to_media[u]
    out[[length(out) + 1]] <- list(
      title    = if (nzchar(title_i)) title_i else u,
      url      = u,
      media_id = if (!is.na(media_i)) unname(media_i) else NULL
    )
    if (length(out) >= max_articles) break
  }
  out
}

make_periods_df <- function(df) {
  df |>
    dplyr::distinct(date_utc, time_interval_utc) |>
    dplyr::arrange(date_utc, time_interval_utc) |>
    dplyr::mutate(
      key   = paste0(date_utc, "_", time_interval_utc),
      label = {
        parts <- strsplit(time_interval_utc, "-")
        est_start <- (as.integer(sapply(parts, `[`, 1)) - 4) %% 24
        est_end   <- (as.integer(sapply(parts, `[`, 2)) - 4) %% 24
        est_interval <- paste0(est_start, "-", est_end)
        # Adjust date if interval crosses midnight (UTC 0-3 → EDT prev day 20-23)
        est_date <- ifelse(as.integer(sapply(parts, `[`, 1)) < 4,
                           format(as.Date(date_utc) - 1, "%b %d"),
                           format(as.Date(date_utc), "%b %d"))
        paste0(est_date, " · ", est_interval, " EDT")
      }
    )
}

make_periods_list <- function(df_p) {
  purrr::map(seq_len(nrow(df_p)), function(i) list(
    key      = df_p$key[i],
    date     = as.character(df_p$date_utc[i]),
    interval = df_p$time_interval_utc[i],
    label    = df_p$label[i]
  ))
}

all_media_ids <- df_objects |>
  dplyr::filter(!is.na(media_id) & media_id != "") |>
  dplyr::distinct(media_id) |>
  dplyr::arrange(media_id) |>
  dplyr::pull(media_id) |>
  as.character()

# ─── graph.json ────────────────────────────────────────────────────────────────

cat("\nAssemblage graph.json (", GRAPH_DAYS, "jours)...\n")

periods_graph <- make_periods_df(df_nodes_graph)

graphs_graph <- purrr::map(countries, function(country) {
  purrr::map(seq_len(nrow(periods_graph)), function(i) {
    d  <- periods_graph$date_utc[i]
    ti <- periods_graph$time_interval_utc[i]

    nodes_i    <- df_nodes_graph |> dplyr::filter(country_id == country, date_utc == d, time_interval_utc == ti) |> dplyr::arrange(dplyr::desc(absolute_normalized_index))
    node_med_i <- df_obj_media   |> dplyr::filter(country_id == country, date_utc == d, time_interval_utc == ti)
    links_i    <- df_edges       |> dplyr::filter(country_id == country, date_utc == d, time_interval_utc == ti)
    link_med_i <- df_edges_media |> dplyr::filter(country_id == country, date_utc == d, time_interval_utc == ti)

    list(
      nodes = purrr::map(seq_len(nrow(nodes_i)), function(j) list(
        id        = nodes_i$extracted_objects[j],
        size      = round(nodes_i$absolute_normalized_index[j], 3),
        n         = nodes_i$n[j],
        articles  = build_articles(nodes_i$urls[j], nodes_i$titles[j]),
        media_ids = {
          mm <- node_med_i |> dplyr::filter(extracted_objects == nodes_i$extracted_objects[j])
          if (nrow(mm) == 0) character(0) else mm$media_ids[[1]]
        }
      )),
      links = purrr::map(seq_len(nrow(links_i)), function(j) list(
        source    = links_i$source[j],
        target    = links_i$target[j],
        value     = links_i$value[j],
        media_ids = {
          lm <- link_med_i |> dplyr::filter(source == links_i$source[j], target == links_i$target[j])
          if (nrow(lm) == 0) character(0) else lm$media_ids[[1]]
        }
      ))
    )
  }) |> setNames(periods_graph$key)
}) |> setNames(countries)

result_graph <- list(
  meta = list(
    generated_at = format(Sys.time(), "%Y-%m-%dT%H:%M:%SZ", tz = "UTC"),
    mode         = "graph",
    graph_days   = GRAPH_DAYS,
    top_n        = TOP_N_OBJECTS,
    media_ids    = all_media_ids,
    periods      = make_periods_list(periods_graph),
    countries    = countries
  ),
  graphs = graphs_graph
)

jsonlite::write_json(result_graph, GRAPH_FILE, auto_unbox = TRUE, pretty = FALSE)
cat("✓ graph.json      :", round(file.size(GRAPH_FILE) / 1024 / 1024, 2), "Mo —",
    nrow(periods_graph), "périodes\n")

# ─── timeseries.json ───────────────────────────────────────────────────────────

cat("\nAssemblage timeseries.json (", HISTORY_DAYS, "jours)...\n")

periods_ts <- make_periods_df(df_nodes)

graphs_ts <- purrr::map(countries, function(country) {
  purrr::map(seq_len(nrow(periods_ts)), function(i) {
    d  <- periods_ts$date_utc[i]
    ti <- periods_ts$time_interval_utc[i]

    nodes_i <- df_nodes |>
      dplyr::filter(country_id == country, date_utc == d, time_interval_utc == ti) |>
      dplyr::arrange(dplyr::desc(absolute_normalized_index))

    list(
      nodes = purrr::map(seq_len(nrow(nodes_i)), function(j) list(
        id       = nodes_i$extracted_objects[j],
        size     = round(nodes_i$absolute_normalized_index[j], 3),
        n        = nodes_i$n[j],
        articles = build_articles(nodes_i$urls[j], nodes_i$titles[j])
      )),
      links = list()
    )
  }) |> setNames(periods_ts$key)
}) |> setNames(countries)

result_ts <- list(
  meta = list(
    generated_at  = format(Sys.time(), "%Y-%m-%dT%H:%M:%SZ", tz = "UTC"),
    mode          = "timeseries",
    history_days  = HISTORY_DAYS,
    top_n         = TOP_N_OBJECTS,
    periods       = make_periods_list(periods_ts),
    countries     = countries
  ),
  graphs = graphs_ts
)

jsonlite::write_json(result_ts, TS_FILE, auto_unbox = TRUE, pretty = FALSE)
cat("✓ timeseries.json :", round(file.size(TS_FILE) / 1024 / 1024, 2), "Mo —",
    nrow(periods_ts), "périodes\n")

# ─── monitor_input.json (tops entrée complets) ───────────────────────────────

cat("\nAssemblage monitor_input.json (tops entrée)...\n")

required_index_cols <- c(
  "country_id", "date_utc", "time_interval_utc", "extracted_objects",
  "absolute_normalized_index", "n", "urls", "titles"
)
required_objects_cols <- c(
  "country_id", "time_interval_utc", "media_id", "url",
  "headline_stop_utc", "extracted_objects"
)

missing_index_cols <- setdiff(required_index_cols, names(df_index))
missing_objects_cols <- setdiff(required_objects_cols, names(df_objects))

if (length(missing_index_cols) > 0) {
  stop("Colonnes manquantes dans df_index: ", paste(missing_index_cols, collapse = ", "))
}
if (length(missing_objects_cols) > 0) {
  stop("Colonnes manquantes dans df_objects: ", paste(missing_objects_cols, collapse = ", "))
}

latest_periods <- df_index |>
  dplyr::distinct(country_id, date_utc, time_interval_utc) |>
  dplyr::arrange(country_id, dplyr::desc(date_utc), dplyr::desc(time_interval_utc)) |>
  dplyr::group_by(country_id) |>
  dplyr::slice_head(n = 1) |>
  dplyr::ungroup() |>
  dplyr::mutate(period_key = paste0(date_utc, "_", time_interval_utc))

build_top_input_rows <- function(country) {
  p <- latest_periods |>
    dplyr::filter(country_id == country)

  if (nrow(p) == 0) {
    return(list(
      period_key = NULL,
      salient_index_top = list(),
      salient_objects_top = list()
    ))
  }

  d <- p$date_utc[[1]]
  ti <- p$time_interval_utc[[1]]
  pk <- p$period_key[[1]]

  idx_top <- df_index |>
    dplyr::filter(country_id == country, date_utc == d, time_interval_utc == ti) |>
    dplyr::arrange(dplyr::desc(absolute_normalized_index), dplyr::desc(n)) |>
    dplyr::slice_head(n = TOP_N_OBJECTS)

  obj_top <- df_objects |>
    dplyr::mutate(period_date = as.Date(substr(as.character(headline_stop_utc), 1, 10))) |>
    dplyr::filter(country_id == country, period_date == d, time_interval_utc == ti) |>
    dplyr::arrange(dplyr::desc(headline_stop_utc)) |>
    dplyr::select(-period_date) |>
    dplyr::slice_head(n = TOP_N_OBJECTS)

  list(
    period_key = pk,
    salient_index_top = rows_to_records(idx_top),
    salient_objects_top = rows_to_records(obj_top)
  )
}

by_country <- purrr::map(countries, build_top_input_rows) |>
  stats::setNames(countries)

monitor_input <- list(
  meta = list(
    generated_at = format(Sys.time(), "%Y-%m-%dT%H:%M:%SZ", tz = "UTC"),
    top_n = TOP_N_OBJECTS,
    countries = countries,
    columns = list(
      salient_index = names(df_index),
      salient_objects = names(df_objects)
    )
  ),
  by_country = by_country
)

jsonlite::write_json(monitor_input, MONITOR_INPUT_FILE, auto_unbox = TRUE, pretty = FALSE)
cat("✓ monitor_input.json:", round(file.size(MONITOR_INPUT_FILE) / 1024, 1), "Ko\n")

cat("\nFini!\n")
