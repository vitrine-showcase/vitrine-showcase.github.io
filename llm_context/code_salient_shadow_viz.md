# Code Source : Visualisation Salient Shadow (Real Data)

Ce document contient le code source du script R utilisé pour générer les visualisations de l'ombre médiatique avec des données réelles.

**Source :** `aws-refiners/refiners/radar-party-score-salient-shadow/viz/viz_real.R`

```R
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

  df <- df |>
    mutate(snap_round = lubridate::round_date(computed_ts, "5 minutes")) |>
    group_by(scope, party, snap_round) |>
    slice_max(computed_ts, n = 1) |>
    ungroup()

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

days_available <- sort(unique(c(fed_raw$period_start, prov_raw$period_start)), decreasing = TRUE)
day_datasets <- purrr::map(days_available, function(d) {
  dat <- transform_period(fed_raw, prov_raw, d)
  if (is.null(dat)) return(NULL)
  dat
}) |> purrr::set_names(as.character(days_available)) |> purrr::compact()

latest_data <- day_datasets[[1]]

get_order <- function(df, parties)
  df |> filter(party %in% parties) |> group_by(party) |>
    slice_max(aw, n = 1, with_ties = FALSE) |>
    ungroup() |> distinct(party, .keep_all = TRUE) |>
    arrange(desc(sov)) |> pull(party)

fed_ord  <- unique(get_order(latest_data, FED_PARTIES))
prov_ord <- unique(get_order(latest_data, PROV_PARTIES))
fed_ord  <- c(fed_ord,  setdiff(FED_PARTIES,  fed_ord))
prov_ord <- c(prov_ord, setdiff(PROV_PARTIES, prov_ord))

# (Suite du script pour le rendu PNG et HTML...)
```
