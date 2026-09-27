// Optimisation : catégories et réglages (impact, difficulté). Textes dans content/<lang>.js → opti.
const T = (id, impact, diff) => ({ id, impact, diff });
export const OPTI = [
  { id: 'windows', icon: 'windows', tips: [T('w_power', 'high', 'easy'), T('w_gamemode', 'med', 'easy'), T('w_epp', 'high', 'easy'), T('w_ptrspeed', 'med', 'easy'), T('w_refresh', 'high', 'easy'), T('w_capture', 'med', 'easy'), T('w_hags', 'low', 'med'), T('w_startup', 'med', 'easy'), T('w_overlays', 'med', 'easy'), T('w_notif', 'low', 'easy'), T('w_updates', 'med', 'easy'), T('w_storage', 'med', 'med'), T('w_vbs', 'low', 'adv')] },
  { id: 'gpu', icon: 'gpu', tips: [T('g_drivers', 'high', 'easy'), T('g_lowlat', 'med', 'easy'), T('g_power', 'med', 'easy'), T('g_texfilter', 'low', 'easy'), T('g_vsync', 'high', 'easy'), T('g_shader', 'low', 'easy'), T('g_amd', 'med', 'easy'), T('g_scaling', 'low', 'med'), T('g_vibrance', 'low', 'easy')] },
  { id: 'cs2', icon: 'target', tips: [T('c_fullscreen', 'high', 'easy'), T('c_reflex', 'high', 'easy'), T('c_vsync', 'high', 'easy'), T('c_fps', 'med', 'easy'), T('c_contrast', 'med', 'easy'), T('c_msaa', 'low', 'easy'), T('c_shadows', 'med', 'easy'), T('c_netbuf', 'med', 'easy'), T('c_audio', 'high', 'easy'), T('c_telemetry', 'low', 'easy'), T('c_crosshair', 'med', 'easy'), T('c_launch', 'low', 'med'), T('c_console', 'low', 'easy')] },
  { id: 'valorant', icon: 'target', tips: [T('v_fullscreen', 'high', 'easy'), T('v_reflex', 'high', 'easy'), T('v_fps', 'med', 'easy'), T('v_quality', 'med', 'easy'), T('v_effects', 'med', 'easy'), T('v_aa', 'low', 'easy'), T('v_rawinput', 'med', 'easy'), T('v_enemy', 'high', 'easy'), T('v_corpses', 'low', 'easy'), T('v_network', 'med', 'easy'), T('v_zoom', 'low', 'easy')] },
  { id: 'mouse', icon: 'mouse', tips: [T('m_poll', 'med', 'easy'), T('m_dpi', 'med', 'easy'), T('m_accel', 'high', 'easy'), T('m_lod', 'low', 'easy'), T('m_feet', 'med', 'easy'), T('m_cable', 'low', 'easy'), T('m_cm360', 'high', 'med')] },
  { id: 'monitor', icon: 'monitor', tips: [T('s_cable', 'high', 'easy'), T('s_od', 'med', 'easy'), T('s_sync', 'med', 'med'), T('s_blur', 'med', 'easy'), T('s_black', 'low', 'easy'), T('s_pos', 'low', 'easy')] },
  { id: 'network', icon: 'wifi', tips: [T('n_eth', 'high', 'easy'), T('n_bg', 'med', 'easy'), T('n_server', 'med', 'easy'), T('n_qos', 'low', 'med'), T('n_router', 'low', 'easy')] },
  { id: 'hardware', icon: 'cpu', tips: [T('h_xmp', 'high', 'med'), T('h_dual', 'med', 'med'), T('h_temps', 'med', 'easy'), T('h_rebar', 'low', 'adv'), T('h_bios', 'low', 'adv')] },
  { id: 'ergo', icon: 'chair', tips: [T('e_posture', 'med', 'easy'), T('e_grip', 'med', 'easy'), T('e_warmup', 'high', 'easy'), T('e_breaks', 'med', 'easy'), T('e_sleep', 'high', 'easy'), T('e_light', 'low', 'easy')] },
];
// Convertisseur : valeur de « yaw » (degrés par unité de sensibilité et par count).
export const GAMES_YAW = { cs2: .022, valorant: .07, apex: .022, ow2: .0066, kovaaks: .022 };
