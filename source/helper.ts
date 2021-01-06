
export const sgr_reset = "\x1b[0m"
export const sgr_bold = "\x1b[1m"
export const sgr_dim = "\x1b[2m"
export const sgr_italic = "\x1b[3m"
export const sgr_underline = "\x1b[4m"
export const sgr_fg = (r: number, g: number, b: number) => `\x1b[38;2;${r};${g};${b}m`
export const sgr_bg = (r: number, g: number, b: number) => `\x1b[48;2;${r};${g};${b}m`

