#!/usr/bin/env Rscript
# ─────────────────────────────────────────────────────────────────────────────
# mock_charts.R — Vitrine Démocratique · Salient Shadow
#
# CONCEPT : L'OMBRE MÉDIATIQUE
#
#   Un seul grand donut par scope (Fédéral | Provincial).
#   Chaque anneau = une extraction temporelle (intérieur = passé, extérieur = maintenant).
#   La LARGEUR de l'arc d'un parti dans chaque anneau = sa part de voix (SOV).
#   La COULEUR = ton de la couverture (rouge → vert).
#   L'éclipse est visuelle : un parti sous le seuil projette une ombre (gnomon).
#   Les arcs se déforment d'un anneau à l'autre, révélant le flux médiatique.
#
# Inspiré des cadrans solaires, Florence Nightingale, et de la géographie de l'invisible.
# ─────────────────────────────────────────────────────────────────────────────

suppressPackageStartupMessages({
  library(dplyr); library(tidyr); library(purrr); library(lubridate)
  library(ggplot2); library(scales); library(base64enc); library(htmltools)
  library(patchwork)
})

OUT_DIR  <- "refiners/radar-party-score-salient-shadow/viz/output"
OUT_HTML <- file.path(OUT_DIR, "radar_partisan.html")
dir.create(OUT_DIR, recursive = TRUE, showWarnings = FALSE)

# ─── CONFIGURATION ─────────────────────────────────────────────────────────

BG          <- "#0D0E1B"   # fond nuit
ECLIPSE_SOV <- 0.02        # seuil d'éclipse
GAP         <- 0.012       # espacement angulaire entre partis (en unités SOV 0-1)
HOLE        <- 0.24        # rayon du trou central
OUTER       <- 0.91        # rayon externe (anneau le plus récent)
RING_SEP    <- 0.003       # trait de séparation entre anneaux

PARTY_SHORT <- c(
  CPC="CPC", LPC="LPC", BQ="BQ",  NDP="NPD", GPC="VERT", PPC="PPC",
  PLQ="PLQ", CAQ="CAQ", PQ="PQ",  QS="QS",   PCQ="PCQ"
)
FED_PARTIES  <- c("CPC","LPC","BQ","NDP","GPC","PPC")
PROV_PARTIES <- c("PLQ","CAQ","PQ","QS","PCQ")

# Palette sombre : rouge → sable → vert
PALETTE <- c("#C0392B","#E07055","#C4BAA8","#2ECC8E","#1A7A4A")
BREAKS  <- c(-1, -0.4, 0, 0.4, 1)

# ─── DONNÉES SIMULÉES ──────────────────────────────────────────────────────

set.seed(2026)
REF_DATE <- as.Date("2026-03-16")

snap_sim <- function(tgt, t0, ns, nt) {
  s <- pmax(tgt + rnorm(length(tgt), 0, ns), 0); s <- s/sum(s)
  t <- pmax(pmin(t0  + rnorm(length(t0),  0, nt), 0.95), -0.95)
  list(sov=s, tone=t)
}

make_day <- function() {
  lbl  <- c("Minuit","Nuit","Matin","Midi","Après-midi","Soir")
  t    <- as.POSIXct(paste0(REF_DATE, sprintf(" %02d:31:00", c(0,4,8,12,16,20))), tz="UTC")
  acc  <- c(0.38,0.54,0.68,0.80,0.91,1.00)
  ft   <- c(CPC=0.293,LPC=0.261,BQ=0.187,NDP=0.123,GPC=0.014,PPC=0.011)
  ftn  <- c(CPC=-0.24,LPC=-0.16,BQ=-0.09,NDP=0.07, GPC=0.15, PPC=-0.05)
  pt   <- c(PLQ=0.596,CAQ=0.154,PQ=0.093,QS=0.049, PCQ=0.008)
  ptn  <- c(PLQ=-0.18,CAQ=-0.07,PQ=0.04, QS=0.17,  PCQ=-0.11)
  map2_dfr(seq_along(t), acc, function(i, aw) {
    ns <- (1-aw)*0.65+0.03
    rf <- snap_sim(ft*aw, ftn, ns*.04, ns*.07)
    rp <- snap_sim(pt*aw, ptn, ns*.05, ns*.07)
    bind_rows(
      tibble(party=names(ft), scope="federal",    aw=aw, snap_lbl=lbl[i], sov=rf$sov, tone=rf$tone),
      tibble(party=names(pt), scope="provincial", aw=aw, snap_lbl=lbl[i], sov=rp$sov, tone=rp$tone)
    )
  }) |> mutate(in_shadow = sov < ECLIPSE_SOV)
}

make_week <- function() {
  days <- seq(floor_date(REF_DATE,"week",week_start=1), by="day", length.out=7)
  lbl  <- c("Lun","Mar","Mer","Jeu","Ven","Sam","Dim")
  fmu  <- c(CPC=0.290,LPC=0.260,BQ=0.182,NDP=0.128,GPC=0.015,PPC=0.011)
  pmu  <- c(PLQ=0.583,CAQ=0.158,PQ=0.092,QS=0.051, PCQ=0.009)
  ftn  <- c(CPC=-0.22,LPC=-0.14,BQ=-0.09,NDP=0.08, GPC=0.14, PPC=-0.06)
  ptn  <- c(PLQ=-0.17,CAQ=-0.06,PQ=0.05, QS=0.16,  PCQ=-0.09)
  map_dfr(seq_along(days), function(i) {
    bq <- c(1,1,1.55,1.25,1,1,1)[i]; plq <- c(1,1,1,1.45,1.20,1,1)[i]
    ft <- ftn+rnorm(6,0,.06); if(i==3) ft["BQ"]  <- ft["BQ"] -.22
    pt <- ptn+rnorm(5,0,.06); if(i==4) pt["PLQ"] <- pt["PLQ"]-.24
    rf <- snap_sim(fmu*c(1,1,bq,1,1,1),  ft, .02,  0)
    rp <- snap_sim(pmu*c(plq,1,1,1,1),   pt, .025, 0)
    bind_rows(
      tibble(party=names(fmu),scope="federal",    aw=i/7,snap_lbl=lbl[i],sov=rf$sov,tone=rf$tone),
      tibble(party=names(pmu),scope="provincial", aw=i/7,snap_lbl=lbl[i],sov=rp$sov,tone=rp$tone)
    )
  }) |> mutate(in_shadow = sov < ECLIPSE_SOV)
}

make_month <- function() {
  days <- seq(floor_date(REF_DATE,"month"), REF_DATE, by="day"); n <- length(days)
  fmu  <- c(CPC=0.302,LPC=0.240,BQ=0.192,NDP=0.118,GPC=0.014,PPC=0.011)
  pmu  <- c(PLQ=0.570,CAQ=0.172,PQ=0.092,QS=0.052, PCQ=0.009)
  ftr  <- c(CPC=-.0028,LPC=.0022,BQ=.0008,NDP=0,GPC=0,PPC=0)
  ptr  <- c(PLQ=-.0015,CAQ=.0010,PQ=.0005,QS=0, PCQ=0)
  map_dfr(seq_along(days), function(i) {
    ft <- c(CPC=-.22,LPC=-.13,BQ=-.08,NDP=.08,GPC=.14,PPC=-.06)+rnorm(6,0,.07)
    pt <- c(PLQ=-.16,CAQ=-.05,PQ=.06, QS=.17, PCQ=-.10)        +rnorm(5,0,.07)
    rf <- snap_sim(fmu+ftr*i, ft, .022, 0)
    rp <- snap_sim(pmu+ptr*i, pt, .025, 0)
    bind_rows(
      tibble(party=names(fmu),scope="federal",    aw=i/n,snap_lbl=format(days[i],"%d"),sov=rf$sov,tone=rf$tone),
      tibble(party=names(pmu),scope="provincial", aw=i/n,snap_lbl=format(days[i],"%d"),sov=rp$sov,tone=rp$tone)
    )
  }) |> mutate(in_shadow = sov < ECLIPSE_SOV)
}

# ─── GRAPHIQUE : OMBRE MÉDIATIQUE ───────────────────────────────────────────
#
#   coord_polar(theta="x")
#   x ∈ [0,1]  → angle 0…2π  (largeur arc = SOV du parti)
#   y ∈ [HOLE, OUTER]          (anneau intérieur = passé, extérieur = présent)
#
#   Partis en éclipse → gnomon de cadran solaire (tige pointillée + ombre)
#
make_arena <- function(df, title, subtitle, fed_order, prov_order) {

  N  <- df |> group_by(party,scope) |> summarise(n=n(),.groups="drop") |> pull(n) |> max()
  # Gaps plus larges pour mois (beaucoup d'anneaux → plus facile de distinguer les secteurs)
  gap_px <- if (N > 10) 0.020 else GAP
  rw  <- (OUTER - HOLE) / N

  df <- df |> group_by(party,scope) |> arrange(aw) |>
    mutate(snap_idx = row_number()) |> ungroup()

  compute_arcs <- function(sdf, order) {
    sdf |>
      group_by(snap_idx) |>
      arrange(snap_idx, match(party, order)) |>
      mutate(
        cum  = cumsum(sov),
        x1   = cum - sov + gap_px/2,
        x2   = pmax(cum - gap_px/2, x1+.002),
        xmid = (x1+x2)/2,
        r_in  = HOLE + (snap_idx-1)*rw,
        r_out = HOLE + snap_idx*rw - RING_SEP
      ) |> ungroup()
  }

  arcs <- bind_rows(
    compute_arcs(df |> filter(scope=="federal"),    fed_order),
    compute_arcs(df |> filter(scope=="provincial"), prov_order)
  )

  rings <- arcs |>
    group_by(scope, party, snap_idx) |>
    reframe(
      angle     = seq(x1[1], x2[1], length.out=max(12L, ceiling((x2[1]-x1[1])*500L))),
      tone      = tone[1],
      r_in      = r_in[1],
      r_out     = r_out[1],
      in_shadow = in_shadow[1],
      is_last   = snap_idx[1] == N
    )

  # ── Labels du dernier anneau ─────────────────────────────────────────────
  labs_all <- arcs |> filter(snap_idx==N) |>
    group_by(scope,party) |> slice(1) |> ungroup() |>
    mutate(
      shrt    = PARTY_SHORT[party],
      sov_pct = sprintf("%.1f%%", sov*100),
      arc_w   = x2 - x1,
      show    = arc_w > 0.020,    # assez large pour un label complet
      gnomon  = !show             # trop petit → cadran solaire
    )

  # Tendance
  if (N > 1) {
    prev <- arcs |> filter(snap_idx==N-1) |>
      select(scope,party,prev_sov=sov) |> distinct()
    labs_all <- labs_all |> left_join(prev, by=c("scope","party")) |>
      mutate(
        delta = sov - prev_sov,
        trend = case_when(delta > .010 ~ "\u2191", delta < -.010 ~ "\u2193", TRUE ~ ""),
        tcol  = case_when(delta > .010 ~ "#2ECC8E", delta < -.010 ~ "#C0392B", TRUE ~ "#DDDDF0")
      )
  } else {
    labs_all <- labs_all |> mutate(trend="", tcol="#DDDDF0", delta=0, prev_sov=sov)
  }

  # Visible : label combiné nom + SOV% (1 seul appel → "\n" = vertical à tout angle)
  labs <- labs_all |> filter(show) |>
    mutate(lbl2 = paste0(shrt, "\n", sov_pct))

  # Gnomons : stagger Y quand deux partis sont angulièrement proches
  gnomons <- labs_all |> filter(gnomon) |>
    arrange(scope, xmid) |>
    group_by(scope) |>
    mutate(
      prev_x = lag(xmid, default = -99),
      stagger = abs(xmid - prev_x) < 0.07,
      y_lbl   = if_else(stagger, OUTER + .22, OUTER + .14)
    ) |>
    ungroup()

  # ── Séparateurs radiaux entre partis (aide pour le mois) ─────────────────
  sep_df <- arcs |> filter(snap_idx==N) |>
    group_by(scope,party) |> slice(1) |> ungroup()

  # ── Centre : label scope ──────────────────────────────────────────────────
  # y=0 = centre exact en coord_polar
  scope_ctr <- tibble(
    scope = c("federal","provincial"),
    label = c("F\u00c9D\u00c9RAL","PROVINCIAL"),
    col   = c("#6BA8E8","#F0A070"),
    x = 0.5, y = 0
  )

  rim <- tibble(angle=seq(0,1,length.out=300), r=OUTER+.005)

  # ── Fond du trou (garantit BG au centre) ─────────────────────────────────
  hole_bg <- tibble(
    angle = seq(0,1,length.out=200),
    scope = rep(c("federal","provincial"), each=100)[1:200]
  )

  ggplot() +

    # Fond trou
    geom_ribbon(data=hole_bg,
      aes(x=angle, ymin=0, ymax=HOLE-.001, group=scope),
      fill=BG, color=NA, inherit.aes=FALSE) +

    # ── Séparateurs entre partis (lignes radiales fines) ──────────────────
    geom_segment(data=sep_df,
      aes(x=x1, xend=x1, y=HOLE, yend=OUTER),
      color=BG, linewidth=1.4, inherit.aes=FALSE) +

    # ── Anneaux éclipse (gris fantôme) ───────────────────────────────────
    geom_ribbon(
      data=rings |> filter(in_shadow),
      aes(x=angle, ymin=r_in, ymax=r_out, group=interaction(party,snap_idx)),
      fill="#16172A", color=BG, linewidth=.5) +

    # ── Anneaux colorés ──────────────────────────────────────────────────
    geom_ribbon(
      data=rings |> filter(!in_shadow),
      aes(x=angle, ymin=r_in, ymax=r_out, fill=tone,
          group=interaction(party,snap_idx)),
      color=BG, linewidth=.5) +

    # ── Liseré blanc sur dernier anneau (présent) ─────────────────────────
    geom_ribbon(
      data=rings |> filter(!in_shadow, is_last),
      aes(x=angle, ymin=r_out-.005, ymax=r_out,
          group=interaction(party,snap_idx)),
      fill="white", alpha=.15, color=NA) +

    # ── Rim ──────────────────────────────────────────────────────────────
    geom_path(data=rim, aes(x=angle,y=r),
      color="#1A1B2C", linewidth=.8, inherit.aes=FALSE) +

    # ════════════════════════════════════════════════════════════════════
    # ── GNOMONS — partis en éclipse (cadran solaire) ──────────────────
    # ── La tige : ligne radiale pointillée du centre vers l'extérieur ──
    geom_segment(data=gnomons,
      aes(x=xmid, xend=xmid, y=HOLE*.5, yend=OUTER+.03),
      color="#2E2E48", linewidth=0.55, linetype="14",
      inherit.aes=FALSE) +

    # ── L'ombre portée : arc fin au sol du cadran (à HOLE) ───────────
    geom_ribbon(
      data = gnomons |>
        group_by(scope,party) |>
        reframe(
          angle = seq(xmid[1]-0.025, xmid[1]+0.025, length.out=40),
          r_in  = HOLE*.12,
          r_out = HOLE*.55
        ),
      aes(x=angle, ymin=r_in, ymax=r_out, group=party),
      fill="#252540", color=NA, alpha=0.8, inherit.aes=FALSE) +

    # ── Label gnomon (nom + % en italique, décalé si collision) ──────
    geom_text(data=gnomons,
      aes(x=xmid, y=y_lbl, label=paste0(shrt,"\n",sov_pct)),
      hjust=0.5, color="#3A3A5C", size=3.3, fontface="italic",
      lineheight=1.1, inherit.aes=FALSE) +
    # ════════════════════════════════════════════════════════════════════

    # ── Label visible : nom + SOV% fusionnés (1 bloc = vertical à tout angle) ──
    geom_text(data=labs,
      aes(x=xmid, y=OUTER+.13, label=lbl2),
      hjust=0.5, color="#DDDDF0", size=4.2, fontface="bold",
      lineheight=1.35, inherit.aes=FALSE) +

    # ── Flèches de tendance ───────────────────────────────────────────
    geom_text(data=labs |> filter(trend!=""),
      aes(x=xmid, y=OUTER+.28, label=trend, color=tcol),
      hjust=0.5, size=5.2, fontface="bold", inherit.aes=FALSE) +

    # ── Label scope au centre ─────────────────────────────────────────
    geom_text(data=scope_ctr,
      aes(x=x, y=y, label=label, color=col),
      size=4.5, fontface="bold", inherit.aes=FALSE) +

    coord_polar(theta="x", clip="off") +
    scale_x_continuous(limits=c(0,1),         expand=c(0,0)) +
    scale_y_continuous(limits=c(0,OUTER+.44), expand=c(0,0)) +
    scale_fill_gradientn(colors=PALETTE, values=rescale(BREAKS),
                         limits=c(-1,1), guide="none") +
    scale_color_identity() +
    facet_wrap(~scope, ncol=2) +
    labs(title=title, subtitle=subtitle) +
    theme_void(base_size=12) +
    theme(
      plot.title    = element_text(family="Georgia, serif", size=26, face="bold",
                        color="#F0EDE8", hjust=.5, margin=margin(b=6)),
      plot.subtitle = element_text(size=10.5, color="#555577",
                        hjust=.5, margin=margin(b=4)),
      strip.text       = element_blank(),
      plot.background  = element_rect(fill=BG, color=NA),
      panel.background = element_rect(fill=BG, color=NA),
      panel.spacing    = unit(-.5,"lines"),
      plot.margin      = margin(28,40,16,40)
    )
}

# ─── GÉNÉRATION ────────────────────────────────────────────────────────────

# ─── GRAPHIQUE : SÉDIMENTATION MÉDIATIQUE ───────────────────────────────────
#
#   1 cercle = 1 parti.
#   Chaque anneau = une tranche temporelle (intérieur = passé, extérieur = présent).
#   L'AIRE de chaque anneau = couverture ABSOLUE à cette extraction.
#     → anneau épais = forte activité, anneau fin = silence.
#   L'arc couvre 360° (pas de SOV angulaire) : l'info est dans l'épaisseur.
#   Le rayon total du cercle = couverture cumulée.
#   Comparaison cross-parti : le plus grand cercle = le plus couvert.
#   Aucune normalisation relative entre partis.
#
make_sediment_panel <- function(df, scope_filter, party_order) {
  HOLE_S <- 0.17
  R_MAX  <- 0.90

  dat <- df |> filter(scope == scope_filter) |>
    group_by(party) |> arrange(aw) |>
    mutate(
      snap_idx = row_number(),
      # Incrément absolu : sov × part de temps apportée par ce snapshot
      delta_aw  = aw - lag(aw, default = 0),
      raw_step  = pmax(sov * delta_aw, 0),
      cum_abs   = cumsum(raw_step)         # couverture cumulée absolue
    ) |>
    ungroup()

  N       <- max(dat$snap_idx)
  max_cum <- max(dat$cum_abs)             # maximum inter-partis (même échelle)
  sfact   <- R_MAX^2 - HOLE_S^2          # plage carrée disponible

  # Rayon area-proportionnel : aire anneau ∝ raw_step → r = sqrt(HOLE² + cum/max·sfact)
  dat <- dat |>
    mutate(
      r_outer   = sqrt(HOLE_S^2 + cum_abs / max_cum * sfact),
      r_inner   = sqrt(HOLE_S^2 + pmax(cum_abs - raw_step, 0) / max_cum * sfact),
      in_shadow = sov < ECLIPSE_SOV,
      is_last   = snap_idx == N,
      party     = factor(party, levels = party_order)
    )

  # Anneaux plein cercle (360°)
  rings <- dat |>
    group_by(party, snap_idx) |>
    reframe(
      angle   = seq(0, 1, length.out = 60),
      r_in    = r_inner[1],
      r_out   = r_outer[1],
      tone    = tone[1],
      in_shad = in_shadow[1],
      is_last = is_last[1]
    ) |>
    filter(r_out > r_in + .0015) |>       # ignorer anneaux quasi-nuls
    mutate(party = factor(party, levels = party_order))

  hole_dat <- tidyr::crossing(
    party = factor(party_order, levels = party_order),
    angle = seq(0, 1, length.out = 80)
  )

  # Labels : nom + % de couverture relative au maximum (repère visuel)
  labs_p <- dat |>
    filter(snap_idx == N) |>
    group_by(party) |> slice(1) |> ungroup() |>
    mutate(
      shrt    = PARTY_SHORT[as.character(party)],
      rel_pct = sprintf("%.0f%%", pmin(cum_abs / max_cum * 100, 100)),
      party   = factor(party, levels = party_order)
    )

  scope_col   <- if (scope_filter == "federal") "#6BA8E8" else "#F0A070"
  scope_label <- if (scope_filter == "federal")
    "\u25cf F\u00c9D\u00c9RAL" else "\u25cf PROVINCIAL"

  ggplot() +
    geom_ribbon(data = rings |> filter(in_shad),
      aes(x = angle, ymin = r_in, ymax = r_out, group = interaction(party, snap_idx)),
      fill = "#16172A", color = BG, linewidth = .2, inherit.aes = FALSE) +
    geom_ribbon(data = rings |> filter(!in_shad),
      aes(x = angle, ymin = r_in, ymax = r_out, fill = tone,
          group = interaction(party, snap_idx)),
      color = BG, linewidth = .2, inherit.aes = FALSE) +
    geom_ribbon(data = rings |> filter(!in_shad, is_last),
      aes(x = angle, ymin = r_out - .004, ymax = r_out,
          group = interaction(party, snap_idx)),
      fill = "white", alpha = .25, color = NA, inherit.aes = FALSE) +
    geom_ribbon(data = hole_dat,
      aes(x = angle, ymin = 0, ymax = HOLE_S - .001, group = party),
      fill = BG, color = NA, inherit.aes = FALSE) +
    geom_text(data = labs_p |> mutate(x = 0.5, y = 0),
      aes(x = x, y = y, label = paste0(shrt, "\n", rel_pct)),
      color = "#DDDDF0", size = 2.9, fontface = "bold", lineheight = 1.3,
      inherit.aes = FALSE) +
    coord_polar(theta = "x", clip = "off") +
    scale_x_continuous(limits = c(0, 1), expand = c(0, 0)) +
    scale_y_continuous(limits = c(0, R_MAX + .08), expand = c(0, 0)) +
    scale_fill_gradientn(colors = PALETTE, values = rescale(BREAKS),
                         limits = c(-1, 1), guide = "none") +
    scale_color_identity() +
    facet_wrap(~party, nrow = 1) +
    labs(tag = scope_label) +
    theme_void(base_size = 10) +
    theme(
      plot.tag          = element_text(color = scope_col, size = 8, face = "bold",
                            hjust = 0, margin = margin(r = 8)),
      plot.tag.position = "left",
      strip.text        = element_blank(),
      plot.background   = element_rect(fill = BG, color = NA),
      panel.background  = element_rect(fill = BG, color = NA),
      panel.spacing     = unit(0.9, "lines"),
      plot.margin       = margin(4, 20, 4, 20)
    )
}

make_sediment <- function(df, title, subtitle, fed_ord, prov_ord) {
  p_fed  <- make_sediment_panel(df, "federal",    fed_ord)
  p_prov <- make_sediment_panel(df, "provincial", prov_ord)

  p_fed / p_prov +
    patchwork::plot_annotation(
      title    = title,
      subtitle = subtitle,
      theme = theme(
        plot.title    = element_text(family = "Georgia, serif", size = 24, face = "bold",
                          color = "#F0EDE8", hjust = .5, margin = margin(b = 6)),
        plot.subtitle = element_text(size = 9.5, color = "#555577",
                          hjust = .5, margin = margin(b = 14)),
        plot.background = element_rect(fill = BG, color = NA),
        plot.margin     = margin(28, 10, 16, 10)
      )
    )
}

# ─── GRAPHIQUE : PAR PARTI ──────────────────────────────────────────────────
#
#   1 donut = 1 parti.
#   L'arc coloré [0, SOV] = présence médiatique (largeur = part de voix).
#   L'arc sombre [SOV, 1] = OMBRE  (ce que le parti n'occupe pas).
#   Les anneaux s'accumulent de l'intérieur (passé) vers l'extérieur (présent).
#
make_parti_panel <- function(df, scope_filter, party_order) {
  dat <- df |> filter(scope == scope_filter) |>
    group_by(party) |> arrange(aw) |>
    mutate(snap_idx = row_number()) |>
    ungroup()

  N  <- max(dat$snap_idx)
  rw <- (OUTER - HOLE) / N

  dat <- dat |>
    mutate(
      r_in      = HOLE + (snap_idx - 1) * rw,
      r_out     = HOLE + snap_idx * rw - RING_SEP,
      in_shadow = sov < ECLIPSE_SOV,
      arc_end   = pmax(sov, .003),
      party     = factor(party, levels = party_order)
    )

  # Anneau sombre complet (toute la surface = ombre par défaut)
  bg_rings <- dat |>
    group_by(party, snap_idx) |>
    reframe(angle = seq(0, 1, length.out = 60),
            r_in = r_in[1], r_out = r_out[1]) |>
    mutate(party = factor(party, levels = party_order))

  # Arc coloré (part de voix)
  col_arcs <- dat |>
    filter(!in_shadow) |>
    group_by(party, snap_idx) |>
    reframe(
      angle   = seq(0, arc_end[1], length.out = max(8L, ceiling(arc_end[1] * 300L))),
      r_in    = r_in[1], r_out = r_out[1],
      tone    = tone[1], is_last = snap_idx[1] == N
    ) |>
    mutate(party = factor(party, levels = party_order))

  # Fond trou (un par parti)
  hole_dat <- tidyr::crossing(
    party = factor(party_order, levels = party_order),
    angle = seq(0, 1, length.out = 80)
  )

  # Labels dernier anneau
  labs_p <- dat |>
    filter(snap_idx == N) |>
    group_by(party) |> slice(1) |> ungroup() |>
    mutate(
      shrt    = PARTY_SHORT[as.character(party)],
      sov_pct = sprintf("%.1f%%", sov * 100),
      party   = factor(party, levels = party_order)
    )

  if (N > 1) {
    prev_p <- dat |> filter(snap_idx == N - 1) |>
      select(party, prev_sov = sov) |> distinct()
    labs_p <- labs_p |> left_join(prev_p, by = "party") |>
      mutate(
        delta = sov - prev_sov,
        trend = case_when(delta > .010 ~ "\u2191", delta < -.010 ~ "\u2193", TRUE ~ ""),
        tcol  = case_when(delta > .010 ~ "#2ECC8E", delta < -.010 ~ "#C0392B", TRUE ~ "#DDDDF0")
      )
  } else {
    labs_p <- labs_p |> mutate(trend = "", tcol = "#DDDDF0", delta = 0, prev_sov = sov)
  }

  scope_col   <- if (scope_filter == "federal")    "#6BA8E8" else "#F0A070"
  scope_label <- if (scope_filter == "federal")
    "\u25cf F\u00c9D\u00c9RAL" else "\u25cf PROVINCIAL"

  ggplot() +
    geom_ribbon(data = bg_rings,
      aes(x = angle, ymin = r_in, ymax = r_out, group = interaction(party, snap_idx)),
      fill = "#16172A", color = BG, linewidth = .2, inherit.aes = FALSE) +
    geom_ribbon(data = col_arcs,
      aes(x = angle, ymin = r_in, ymax = r_out, fill = tone,
          group = interaction(party, snap_idx)),
      color = BG, linewidth = .2, inherit.aes = FALSE) +
    geom_ribbon(data = col_arcs |> filter(is_last),
      aes(x = angle, ymin = r_out - .004, ymax = r_out,
          group = interaction(party, snap_idx)),
      fill = "white", alpha = .22, color = NA, inherit.aes = FALSE) +
    geom_ribbon(data = hole_dat,
      aes(x = angle, ymin = 0, ymax = HOLE - .001, group = party),
      fill = BG, color = NA, inherit.aes = FALSE) +
    # Nom + SOV% au centre du trou
    geom_text(data = labs_p |> mutate(x = 0.5, y = 0),
      aes(x = x, y = y, label = paste0(shrt, "\n", sov_pct)),
      color = "#DDDDF0", size = 2.9, fontface = "bold", lineheight = 1.3,
      inherit.aes = FALSE) +
    # Flèche tendance au-dessus du donut
    geom_text(data = labs_p |> filter(trend != "") |> mutate(x = 0.5, y = OUTER + .16),
      aes(x = x, y = y, label = trend, color = tcol),
      hjust = 0.5, size = 3.8, fontface = "bold", inherit.aes = FALSE) +
    coord_polar(theta = "x", clip = "off") +
    scale_x_continuous(limits = c(0, 1), expand = c(0, 0)) +
    scale_y_continuous(limits = c(0, OUTER + .28), expand = c(0, 0)) +
    scale_fill_gradientn(colors = PALETTE, values = rescale(BREAKS),
                         limits = c(-1, 1), guide = "none") +
    scale_color_identity() +
    facet_wrap(~party, nrow = 1) +
    labs(tag = scope_label) +
    theme_void(base_size = 10) +
    theme(
      plot.tag          = element_text(color = scope_col, size = 8, face = "bold",
                            hjust = 0, margin = margin(r = 8)),
      plot.tag.position = "left",
      strip.text        = element_blank(),
      plot.background   = element_rect(fill = BG, color = NA),
      panel.background  = element_rect(fill = BG, color = NA),
      panel.spacing     = unit(0.9, "lines"),
      plot.margin       = margin(4, 20, 4, 20)
    )
}

make_parti <- function(df, title, subtitle, fed_ord, prov_ord) {
  p_fed  <- make_parti_panel(df, "federal",    fed_ord)
  p_prov <- make_parti_panel(df, "provincial", prov_ord)

  p_fed / p_prov +
    patchwork::plot_annotation(
      title    = title,
      subtitle = subtitle,
      theme = theme(
        plot.title    = element_text(family = "Georgia, serif", size = 24, face = "bold",
                          color = "#F0EDE8", hjust = .5, margin = margin(b = 6)),
        plot.subtitle = element_text(size = 9.5, color = "#555577",
                          hjust = .5, margin = margin(b = 14)),
        plot.background = element_rect(fill = BG, color = NA),
        plot.margin     = margin(28, 10, 16, 10)
      )
    )
}

# ─── GÉNÉRATION ────────────────────────────────────────────────────────────
# Guard : `source("mock_charts.R")` dans viz_real.R ne déclenche pas l'exécution
if (exists(".viz_source_only") && isTRUE(.viz_source_only)) {
  cat("(sourced as library)\n")
} else {

cat("Simulation...\n")
day_data   <- make_day()
week_data  <- make_week()
month_data <- make_month()

get_order <- function(df, parties)
  df |> filter(party %in% parties) |> group_by(party) |>
    slice_tail(n=1) |> arrange(desc(sov)) |> pull(party)

fed_ord  <- get_order(day_data, FED_PARTIES)
prov_ord <- get_order(day_data, PROV_PARTIES)

charts <- list(
  day = list(
    data=day_data,
    title="L'Ombre Médiatique",
    subtitle=paste0(format(REF_DATE,"%d %B %Y"),
      "  \u00b7  Journ\u00e9e en cours  \u00b7  ",
      "Anneaux int\u00e9rieur\u2192ext\u00e9rieur : Minuit \u00b7 Nuit \u00b7 Matin \u00b7 Midi \u00b7 Apr\u00e8s-midi \u00b7 Soir")
  ),
  week = list(
    data=week_data,
    title="L'Ombre Médiatique",
    subtitle=paste0("Semaine du ",
      format(floor_date(REF_DATE,"week",week_start=1),"%d %B %Y"),
      "  \u00b7  Anneaux int\u00e9rieur\u2192ext\u00e9rieur : Lun \u00b7 Mar \u00b7 Mer \u00b7 Jeu \u00b7 Ven \u00b7 Sam \u00b7 Dim")
  ),
  month = list(
    data=month_data,
    title="L'Ombre Médiatique",
    subtitle=paste0("Mars 2026  \u00b7  ",
      format(floor_date(REF_DATE,"month"),"%d %b"),
      " \u2192 ",format(REF_DATE,"%d %b"),
      "  \u00b7  ",
      as.integer(REF_DATE-floor_date(REF_DATE,"month")+1),
      " anneaux (un par jour)")
  )
)

png_uris <- list()
for (nm in names(charts)) {
  cat(sprintf("Rendu %s...\n", nm))
  ch <- charts[[nm]]
  p  <- make_arena(ch$data, ch$title, ch$subtitle, fed_ord, prov_ord)
  fp <- file.path(OUT_DIR, paste0("chart_", nm, ".png"))
  ggsave(fp, p, width=16, height=8.5, dpi=180, bg=BG, device=ragg::agg_png)
  png_uris[[nm]] <- dataURI(file=fp, mime="image/png")
}

parti_uris <- list()
for (nm in names(charts)) {
  cat(sprintf("Rendu parti_%s...\n", nm))
  ch <- charts[[nm]]
  p  <- make_parti(ch$data, ch$title, ch$subtitle, fed_ord, prov_ord)
  fp <- file.path(OUT_DIR, paste0("parti_", nm, ".png"))
  ggsave(fp, p, width=16, height=7.5, dpi=180, bg=BG, device=ragg::agg_png)
  parti_uris[[nm]] <- dataURI(file=fp, mime="image/png")
}

sediments <- list(
  day = list(
    data=day_data,
    title="S\u00e9dimentation M\u00e9diatique",
    subtitle=paste0(format(REF_DATE,"%d %B %Y"),
      "  \u00b7  \u00c9paisseur des couches : Minuit \u00b7 Nuit \u00b7 Matin \u00b7 Midi \u00b7 Apr\u00e8s-midi \u00b7 Soir")
  ),
  week = list(
    data=week_data,
    title="S\u00e9dimentation M\u00e9diatique",
    subtitle=paste0("Semaine du ",
      format(floor_date(REF_DATE,"week",week_start=1),"%d %B %Y"),
      "  \u00b7  Une couche par jour  \u00b7  \u00e9paisseur = couverture absolue")
  ),
  month = list(
    data=month_data,
    title="S\u00e9dimentation M\u00e9diatique",
    subtitle=paste0("Mars 2026  \u00b7  ",
      as.integer(REF_DATE-floor_date(REF_DATE,"month")+1),
      " couches (1 par jour)  \u00b7  \u00e9paisseur = minutes de couverture")
  )
)

sediment_uris <- list()
for (nm in names(sediments)) {
  cat(sprintf("Rendu sediment_%s...\n", nm))
  ch <- sediments[[nm]]
  p  <- make_sediment(ch$data, ch$title, ch$subtitle, fed_ord, prov_ord)
  fp <- file.path(OUT_DIR, paste0("sediment_", nm, ".png"))
  ggsave(fp, p, width=16, height=7.5, dpi=180, bg=BG, device=ragg::agg_png)
  sediment_uris[[nm]] <- dataURI(file=fp, mime="image/png")
}

# ─── ASSEMBLAGE HTML ────────────────────────────────────────────────────────

cat("HTML...\n")

CSS <- "
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{
  font-family:'Helvetica Neue',Arial,sans-serif;
  background:#0D0E1B;
  color:#9999BB;
  -webkit-font-smoothing:antialiased;
}

/* ── Header ── */
header{
  padding:36px 56px 28px;
  display:flex;justify-content:space-between;align-items:flex-end;
}
.kicker{
  font-size:9.5px;letter-spacing:3px;text-transform:uppercase;
  color:#C0392B;margin-bottom:10px;
}
h1{
  font-family:Georgia,serif;font-size:32px;font-weight:700;
  color:#F0EDE8;line-height:1.1;letter-spacing:-.5px;
}
.meta{font-size:11px;color:#252538;text-align:right;line-height:2.2}

/* ── Tabs ── */
nav{
  display:flex;padding:0 56px;
  border-bottom:1px solid #13142299;
}
nav input{display:none}
nav label{
  padding:14px 32px;
  font-size:10.5px;font-weight:700;letter-spacing:1.8px;
  text-transform:uppercase;color:#252538;
  cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;
}
nav label:hover{color:#555577}
#t1:checked~nav label[for=t1],
#t2:checked~nav label[for=t2],
#t3:checked~nav label[for=t3],
#t4:checked~nav label[for=t4],
#t5:checked~nav label[for=t5]{color:#F0EDE8;border-bottom-color:#C0392B}

/* ── Panels ── */
.panel{display:none;padding:0 0 48px}
#t1:checked~.p1,#t2:checked~.p2,#t3:checked~.p3,
#t4:checked~.p4,#t5:checked~.p5{display:block}

/* ── Par Parti period headers ── */
.period-hd{
  padding:24px 56px 4px;
  font-size:9px;letter-spacing:2.5px;text-transform:uppercase;
  color:#2A2A4A;font-weight:700;
}
.chart img{width:100%;display:block}

/* ── Legend ── */
.legend{
  display:flex;align-items:center;gap:18px;
  justify-content:center;padding:20px 56px 0;
  font-size:9.5px;letter-spacing:1px;text-transform:uppercase;color:#252538;
}
.grad{
  width:110px;height:5px;border-radius:3px;
  background:linear-gradient(to right,#C0392B,#E07055,#C4BAA8,#2ECC8E,#1A7A4A);
}
.sep{color:#13141F;margin:0 2px}

/* ── Read ── */
.read{
  padding:18px 56px 0;
  font-size:13px;color:#1E1F30;line-height:2.0;
}
.read b{color:#2A2A4A}
"

panel <- function(id, uri, note) {
  div(class=paste0("panel p",id),
    div(class="chart", tags$img(src=uri, alt="")),
    div(class="legend",
      span(style="color:#C0392B;font-weight:700","Négatif"),
      div(class="grad"),
      span(style="color:#2ECC8E;font-weight:700","Positif"),
      span(class="sep","|"),
      span("Arc large = forte présence"),
      span(class="sep","|"),
      span(style="color:#191929;background:#191929;border-radius:2px;padding:0 10px","éclipse")
    ),
    div(class="read", HTML(note))
  )
}

save_html(
  tagList(tags$html(lang="fr",
    tags$head(
      tags$meta(charset="UTF-8"),
      tags$meta(name="viewport",content="width=device-width,initial-scale=1"),
      tags$title("L\u2019Ar\u00e8ne M\u00e9diatique"),
      tags$style(HTML(CSS))
    ),
    tags$body(
      tags$input(type="radio",id="t1",name="t",checked=NA),
      tags$input(type="radio",id="t2",name="t"),
      tags$input(type="radio",id="t3",name="t"),
      tags$input(type="radio",id="t4",name="t"),
      tags$input(type="radio",id="t5",name="t"),

      tags$header(
        div(
          div(class="kicker","Vitrine D\u00e9mocratique \u00b7 Salient Shadow"),
          tags$h1("L\u2019Ombre M\u00e9diatique")
        ),
        div(class="meta",
          format(REF_DATE,"%d %B %Y"), tags$br(),
          "Couverture m\u00e9diatique canadienne")
      ),

      tags$nav(
        tags$label(`for`="t1","Journ\u00e9e"),
        tags$label(`for`="t2","Semaine"),
        tags$label(`for`="t3","Mois"),
        tags$label(`for`="t4","Par Parti"),
        tags$label(`for`="t5","S\u00e9dimentation")
      ),

      panel(1, png_uris$day, paste0(
        "<b>Lecture</b> \u2014 Chaque donut = un scope (F\u00e9d\u00e9ral | Provincial). ",
        "La <b>largeur de l\u2019arc</b> d\u2019un parti dans un anneau = sa part de voix (SOV) \u00e0 cette extraction. ",
        "Les anneaux s\u2019accumulent de l\u2019int\u00e9rieur (Minuit) vers l\u2019ext\u00e9rieur (Soir). ",
        "La couleur = ton m\u00e9diatique. ",
        "Un arc quasi invisible = \u00e9clipse m\u00e9diatique (SOV\u00a0<\u00a02\u00a0%). ",
        "Les d\u00e9formations d\u2019un anneau \u00e0 l\u2019autre montrent le flux de la journ\u00e9e."
      )),
      panel(2, png_uris$week, paste0(
        "<b>Lecture</b> \u2014 7 anneaux (Lundi intérieur \u2192 Dimanche ext\u00e9rieur). ",
        "Pic du BQ mercredi : son arc s\u2019\u00e9largit au 3\u1d49 anneau. ",
        "Le PLQ vire au rouge-sombre jeudi apr\u00e8s une conf\u00e9rence de presse tendue. ",
        "Les fl\u00e8ches \u2191\u2193 = tendance du dernier jour vs avant-dernier."
      )),
      panel(3, png_uris$month, paste0(
        "<b>Lecture</b> \u2014 ",
        as.integer(REF_DATE-floor_date(REF_DATE,"month")+1),
        " anneaux (1\u1d49\u02b3 mars int\u00e9rieur \u2192 16 mars ext\u00e9rieur). ",
        "La d\u00e9rive progressive des arcs trahit les tendances de fond : ",
        "CPC en l\u00e9ger recul, LPC en remont\u00e9e, PLQ dominant la sc\u00e8ne provinciale."
      )),

      # ── 5e onglet : Sédimentation ─────────────────────────────────────
      div(class="panel p5",
        div(class="period-hd","Journ\u00e9e"),
        div(class="chart", tags$img(src=sediment_uris$day,   alt="")),
        div(class="period-hd","Semaine"),
        div(class="chart", tags$img(src=sediment_uris$week,  alt="")),
        div(class="period-hd","Mois"),
        div(class="chart", tags$img(src=sediment_uris$month, alt="")),
        div(class="legend",
          span(style="color:#C0392B;font-weight:700","N\u00e9gatif"),
          div(class="grad"),
          span(style="color:#2ECC8E;font-weight:700","Positif"),
          span(class="sep","|"),
          span("Anneau \u00e9pais = forte couverture absolue"),
          span(class="sep","|"),
          span("Grand cercle = plus couvert")
        ),
        div(class="read", HTML(paste0(
          "<b>Lecture</b> \u2014 Chaque cercle = un parti. ",
          "Les couches s\u2019accumulent de l\u2019int\u00e9rieur (pass\u00e9) vers l\u2019ext\u00e9rieur (pr\u00e9sent). ",
          "L\u2019<b>\u00e9paisseur</b> de chaque anneau est proportionnelle \u00e0 la couverture <b>absolue</b> \u00e0 ce moment : ",
          "un anneau \u00e9pais = forte activit\u00e9, un anneau fin = silence m\u00e9diatique. ",
          "Le <b>rayon total</b> du cercle refl\u00e8te la couverture cumul\u00e9e sur la p\u00e9riode \u2014 ",
          "tous les partis partagent la m\u00eame \u00e9chelle : le plus grand cercle = le plus couvert. ",
          "Le pourcentage au centre = proportion relative au parti le plus couvert."
        )))
      ),

      # ── 4e onglet : Par Parti ──────────────────────────────────────────
      div(class="panel p4",
        div(class="period-hd","Journ\u00e9e"),
        div(class="chart", tags$img(src=parti_uris$day,   alt="")),
        div(class="period-hd","Semaine"),
        div(class="chart", tags$img(src=parti_uris$week,  alt="")),
        div(class="period-hd","Mois"),
        div(class="chart", tags$img(src=parti_uris$month, alt="")),
        div(class="legend",
          span(style="color:#C0392B;font-weight:700","N\u00e9gatif"),
          div(class="grad"),
          span(style="color:#2ECC8E;font-weight:700","Positif"),
          span(class="sep","|"),
          span("Arc color\u00e9 = pr\u00e9sence m\u00e9diatique"),
          span(class="sep","|"),
          span(style="color:#191929;background:#191929;border-radius:2px;padding:0 10px",
               "\u00e9clipse")
        ),
        div(class="read", HTML(paste0(
          "<b>Lecture</b> \u2014 Chaque cercle = un parti. ",
          "L\u2019arc color\u00e9 repr\u00e9sente la <b>part de voix (SOV)</b> : ",
          "un arc couvrant la moiti\u00e9 du cercle = 50\u00a0% de la couverture. ",
          "L\u2019espace sombre = l\u2019<b>ombre m\u00e9diatique</b> : la visibilit\u00e9 que le parti n\u2019occupe pas. ",
          "Les anneaux s\u2019accumulent de l\u2019int\u00e9rieur (pass\u00e9) vers l\u2019ext\u00e9rieur (pr\u00e9sent). ",
          "Un parti en \u00e9clipse compl\u00e8te aura un donut enti\u00e8rement sombre."
        )))
      )
    )
  )),
  file=OUT_HTML
)

cat(sprintf("\n\u2714 %s\n", OUT_HTML))

} # end if (!.viz_source_only)
