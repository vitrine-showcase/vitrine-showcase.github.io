#!/usr/bin/env Rscript
# ─────────────────────────────────────────────────────────────────────────────
# viz_real.R — L'Ombre Médiatique avec données réelles salient-shadow
#
# Usage: Rscript refiners/radar-party-score-salient-shadow/viz/viz_real.R [DEV|PROD]
# ─────────────────────────────────────────────────────────────────────────────

suppressPackageStartupMessages({
  library(dplyr); library(tidyr); library(purrr); library(lubridate)
  library(ggplot2); library(scales); library(base64enc); library(htmltools)
  library(patchwork); library(tube)
})

# ── Charger les fonctions de mock_charts.R sans déclencher l'exécution ──────
.viz_source_only <- TRUE
source("refiners/radar-party-score-salient-shadow/viz/mock_charts.R")
rm(.viz_source_only)

# ── Config ───────────────────────────────────────────────────────────────────
ARGS <- commandArgs(trailingOnly = TRUE)
ENV  <- if (length(ARGS) > 0 && toupper(ARGS[1]) %in% c("DEV","PROD")) toupper(ARGS[1]) else "DEV"

OUT_DIR  <- "refiners/radar-party-score-salient-shadow/viz/output"
OUT_HTML <- file.path(OUT_DIR, "radar_real.html")
dir.create(OUT_DIR, recursive = TRUE, showWarnings = FALSE)

TBL_FED  <- "vitrine_datamart-federal_parties_salient_shadow_day"
TBL_PROV <- "vitrine_datamart-provincial_parties_salient_shadow_day"

# ── Chargement ───────────────────────────────────────────────────────────────
cat(sprintf("Connexion %s...\n", ENV))
con <- tube::ellipse_connect(ENV, "datamarts")
fed_raw  <- tube::ellipse_query(con, TBL_FED)  |> collect()
prov_raw <- tube::ellipse_query(con, TBL_PROV) |> collect()
tube::ellipse_disconnect(con)

cat(sprintf("Lignes chargées : %d fédéral, %d provincial\n", nrow(fed_raw), nrow(prov_raw)))

# ── Transformation ───────────────────────────────────────────────────────────
# Transforme les données d'une période en format attendu par make_arena/make_parti/make_sediment
# Retourne NULL si pas de données pour cette période.
transform_period <- function(fed_df, prov_df, period_start_filter) {
  df <- bind_rows(
    fed_df  |> mutate(scope = "federal"),
    prov_df |> mutate(scope = "provincial")
  ) |>
    filter(!is.na(computed_at), period_start == period_start_filter) |>
    mutate(
      computed_ts  = lubridate::ymd_hms(computed_at, tz = "UTC"),
      computed_mtl = lubridate::with_tz(computed_ts, tzone = "America/Montreal")
    )

  if (nrow(df) == 0) return(NULL)

  # Dédupliquer : snapshots fédéral/provincial publiés à < 2 min d'écart = même run
  df <- df |>
    mutate(snap_round = lubridate::round_date(computed_ts, "5 minutes")) |>
    group_by(scope, party, snap_round) |>
    slice_max(computed_ts, n = 1) |>
    ungroup()

  # aw = fraction du jour écoulée (heure Montréal / 24h depuis minuit)
  midnight_mtl <- lubridate::ymd(period_start_filter, tz = "America/Montreal")

  df |>
    mutate(
      aw        = pmin(
        as.numeric(difftime(computed_mtl, midnight_mtl, units = "hours")) / 24,
        0.9999
      ),
      snap_lbl  = format(computed_mtl, "%Hh%M"),
      sov       = weighted_mentions,
      tone      = weighted_tone,
      in_shadow = sov < ECLIPSE_SOV
    ) |>
    select(party, scope, aw, snap_lbl, sov, tone, in_shadow) |>
    arrange(scope, party, aw)
}

# Identifier les jours disponibles, du plus récent au plus ancien
days_available <- sort(unique(c(fed_raw$period_start, prov_raw$period_start)), decreasing = TRUE)
cat(sprintf("Jours disponibles : %s\n", paste(days_available, collapse = ", ")))

# Construire un dataset par jour
day_datasets <- purrr::map(days_available, function(d) {
  dat <- transform_period(fed_raw, prov_raw, d)
  if (is.null(dat)) return(NULL)
  n_snaps <- dat |> distinct(scope, aw) |> nrow()
  cat(sprintf("  %s : %d snapshots\n", d, n_snaps / 2))
  dat
}) |> purrr::set_names(as.character(days_available)) |> purrr::compact()

if (length(day_datasets) == 0) stop("Aucune donnée disponible.")

# ── Ordres des partis (SOV décroissant sur le snapshot le plus récent) ───────
latest_data <- day_datasets[[1]]

get_order <- function(df, parties)
  df |> filter(party %in% parties) |> group_by(party) |>
    slice_max(aw, n = 1, with_ties = FALSE) |>
    ungroup() |> distinct(party, .keep_all = TRUE) |>
    arrange(desc(sov)) |> pull(party)

fed_ord  <- unique(get_order(latest_data, FED_PARTIES))
prov_ord <- unique(get_order(latest_data, PROV_PARTIES))

# Partis manquants (pas encore apparus) → les ajouter à la fin
fed_ord  <- c(fed_ord,  setdiff(FED_PARTIES,  fed_ord))
prov_ord <- c(prov_ord, setdiff(PROV_PARTIES, prov_ord))

cat(sprintf("Ordre fédéral   : %s\n", paste(fed_ord,  collapse = " > ")))
cat(sprintf("Ordre provincial: %s\n", paste(prov_ord, collapse = " > ")))

# ── Affichage des SOV finaux ─────────────────────────────────────────────────
cat("\n=== SOV dernier snapshot ===\n")
latest_data |>
  group_by(scope, party) |> slice_max(aw, n = 1) |> ungroup() |>
  select(scope, party, sov, tone, in_shadow) |>
  arrange(scope, desc(sov)) |>
  print(n = 20)

# ── Subtitle helpers ─────────────────────────────────────────────────────────
make_subtitle_day <- function(d, dat) {
  snaps <- dat |> distinct(aw, snap_lbl) |> arrange(aw) |> pull(snap_lbl)
  n <- length(snaps)
  status <- if (as.Date(d) == Sys.Date()) "En cours" else "Terminée"
  paste0(
    format(as.Date(d), "%d %B %Y"),
    "  \u00b7  ", status,
    "  \u00b7  ",
    n, " extraction", if (n > 1) "s" else "",
    " : ", paste(snaps, collapse = " \u00b7 ")
  )
}

# ── Rendu des charts ─────────────────────────────────────────────────────────
png_uris     <- list()
parti_uris   <- list()
sediment_uris <- list()

for (day_key in names(day_datasets)) {
  dat      <- day_datasets[[day_key]]
  title    <- "L\u2019Ombre M\u00e9diatique"
  subtitle <- make_subtitle_day(day_key, dat)

  cat(sprintf("\nRendu arène %s...\n", day_key))
  p <- make_arena(dat, title, subtitle, fed_ord, prov_ord)
  fp <- file.path(OUT_DIR, paste0("real_arena_", day_key, ".png"))
  ggsave(fp, p, width = 16, height = 8.5, dpi = 180, bg = BG, device = ragg::agg_png)
  png_uris[[day_key]] <- dataURI(file = fp, mime = "image/png")

  cat(sprintf("Rendu par-parti %s...\n", day_key))
  p <- make_parti(dat, title, subtitle, fed_ord, prov_ord)
  fp <- file.path(OUT_DIR, paste0("real_parti_", day_key, ".png"))
  ggsave(fp, p, width = 16, height = 7.5, dpi = 180, bg = BG, device = ragg::agg_png)
  parti_uris[[day_key]] <- dataURI(file = fp, mime = "image/png")

  cat(sprintf("Rendu sédimentation %s...\n", day_key))
  title_sed <- "S\u00e9dimentation M\u00e9diatique"
  p <- make_sediment(dat, title_sed, subtitle, fed_ord, prov_ord)
  fp <- file.path(OUT_DIR, paste0("real_sediment_", day_key, ".png"))
  ggsave(fp, p, width = 16, height = 7.5, dpi = 180, bg = BG, device = ragg::agg_png)
  sediment_uris[[day_key]] <- dataURI(file = fp, mime = "image/png")
}

# ── CSS (réutilisé depuis mock_charts) ───────────────────────────────────────
n_tabs <- length(day_datasets)
tab_checked_css <- paste(
  sprintf("#t%d:checked~nav label[for=t%d]", seq_len(n_tabs), seq_len(n_tabs)),
  collapse = ",\n"
)
panel_show_css <- paste(
  sprintf("#t%d:checked~.p%d", seq_len(n_tabs), seq_len(n_tabs)),
  collapse = ","
)

CSS_REAL <- sprintf("
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Helvetica Neue',Arial,sans-serif;background:#0D0E1B;color:#9999BB;-webkit-font-smoothing:antialiased;}
header{padding:36px 56px 28px;display:flex;justify-content:space-between;align-items:flex-end;}
.kicker{font-size:9.5px;letter-spacing:3px;text-transform:uppercase;color:#C0392B;margin-bottom:10px;}
h1{font-family:Georgia,serif;font-size:32px;font-weight:700;color:#F0EDE8;line-height:1.1;letter-spacing:-.5px;}
.meta{font-size:11px;color:#252538;text-align:right;line-height:2.2}
nav{display:flex;padding:0 56px;border-bottom:1px solid #13142299;}
nav input{display:none}
nav label{padding:14px 32px;font-size:10.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#252538;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;}
nav label:hover{color:#555577}
%s{color:#F0EDE8;border-bottom-color:#C0392B}
.panel{display:none;padding:0 0 48px}
%s{display:block}
.chart img{width:100%%;display:block}
.legend{display:flex;align-items:center;gap:18px;justify-content:center;padding:20px 56px 0;font-size:9.5px;letter-spacing:1px;text-transform:uppercase;color:#252538;}
.grad{width:110px;height:5px;border-radius:3px;background:linear-gradient(to right,#C0392B,#E07055,#C4BAA8,#2ECC8E,#1A7A4A);}
.sep{color:#13141F;margin:0 2px}
.view-hd{padding:20px 56px 4px;font-size:8px;letter-spacing:2.5px;text-transform:uppercase;color:#2A2A4A;font-weight:700;}
.read{padding:18px 56px 0;font-size:13px;color:#1E1F30;line-height:2.0;}
.read b{color:#2A2A4A}
", tab_checked_css, panel_show_css)

# ── Assemblage HTML ───────────────────────────────────────────────────────────
cat("\nHTML...\n")

# Inputs radio
inputs <- purrr::imap(day_datasets, function(dat, key) {
  i <- which(names(day_datasets) == key)
  if (i == 1) tags$input(type = "radio", id = paste0("t", i), name = "t", checked = NA)
  else        tags$input(type = "radio", id = paste0("t", i), name = "t")
})

# Labels nav
nav_labels <- purrr::imap(day_datasets, function(dat, key) {
  i   <- which(names(day_datasets) == key)
  lbl <- if (as.Date(key) == Sys.Date())
    paste0("Aujourd\u2019hui \u00b7 ", format(as.Date(key), "%d %b"))
  else
    format(as.Date(key), "%d %b")
  tags$label(`for` = paste0("t", i), lbl)
})

legend_div <- div(class = "legend",
  span(style = "color:#C0392B;font-weight:700", "N\u00e9gatif"),
  div(class = "grad"),
  span(style = "color:#2ECC8E;font-weight:700", "Positif"),
  span(class = "sep", "|"),
  span("Arc large = forte pr\u00e9sence"),
  span(class = "sep", "|"),
  span(style = "color:#191929;background:#191929;border-radius:2px;padding:0 10px", "\u00e9clipse")
)

# Panels (un par jour, avec 3 vues : arène / par-parti / sédimentation)
panels <- purrr::imap(day_datasets, function(dat, key) {
  i        <- which(names(day_datasets) == key)
  subtitle <- make_subtitle_day(key, dat)
  n_snaps  <- dat |> distinct(aw) |> nrow()

  div(class = paste0("panel p", i),
    div(class = "view-hd", "Vue globale \u2014 Part de voix relative (SOV)"),
    div(class = "chart", tags$img(src = png_uris[[key]], alt = "")),
    legend_div,
    div(class = "view-hd", "Vue par parti \u2014 Arc color\u00e9 = pr\u00e9sence, espace sombre = ombre"),
    div(class = "chart", tags$img(src = parti_uris[[key]], alt = "")),
    div(class = "view-hd", "S\u00e9dimentation \u2014 \u00c9paisseur des couches = couverture absolue"),
    div(class = "chart", tags$img(src = sediment_uris[[key]], alt = "")),
    div(class = "read", HTML(paste0(
      "<b>", format(as.Date(key), "%d %B %Y"), "</b> \u2014 ",
      n_snaps, " snapshot", if (n_snaps > 1) "s" else "",
      " disponible", if (n_snaps > 1) "s" else "", ". ",
      "SOV fédéral : ",
      paste(
        dat |> filter(scope == "federal") |> group_by(party) |>
          slice_max(aw, n = 1) |> filter(sov > 0) |>
          arrange(desc(sov)) |>
          mutate(lbl = paste0("<b>", party, "</b>\u00a0", sprintf("%.1f%%", sov * 100))) |>
          pull(lbl),
        collapse = ", "
      ), "."
    )))
  )
})

save_html(
  tagList(tags$html(lang = "fr",
    tags$head(
      tags$meta(charset = "UTF-8"),
      tags$meta(name = "viewport", content = "width=device-width,initial-scale=1"),
      tags$title("L\u2019Ombre M\u00e9diatique \u2014 Donn\u00e9es r\u00e9elles"),
      tags$style(HTML(CSS_REAL))
    ),
    tags$body(
      tagList(inputs),
      tags$header(
        div(
          div(class = "kicker", "Vitrine D\u00e9mocratique \u00b7 Salient Shadow \u00b7 Donn\u00e9es r\u00e9elles"),
          tags$h1("L\u2019Ombre M\u00e9diatique")
        ),
        div(class = "meta",
          format(Sys.Date(), "%d %B %Y"), tags$br(),
          sprintf("Source : %s \u00b7 _day tables uniquement", ENV)
        )
      ),
      tags$nav(tagList(nav_labels)),
      tagList(panels)
    )
  )),
  file = OUT_HTML
)

cat(sprintf("\n\u2714 %s\n", OUT_HTML))
