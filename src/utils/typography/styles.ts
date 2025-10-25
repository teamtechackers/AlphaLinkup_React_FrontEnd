import { COLORS } from "../theme/colors"
import { FONTS } from "./fonts"

export const STYLES = {

 page_title: {
  color: COLORS.black,
  ...FONTS.inter_500_20_75,
 },

 nav_item: {
    color: COLORS.darkGray,
    ...FONTS.inter_500_16_24,
  },

  label: {
    color: COLORS.darkGray,
    ...FONTS.nunito_400_14_14,
  },

  label_2: {
    color: COLORS.black,
    ...FONTS.inter_500_24_26,
  },

  label_3: {
    color: COLORS.darkGray,
    ...FONTS.nunito_400_14_14,
  },

  footer_text: {
    color: COLORS.black,
    ...FONTS.nunito_400_14_21,
  },

  table_title: {
    color: COLORS.darkGray,
    ...FONTS.inter_500_16_24,
  },

  form_title: {
    color: COLORS.darkGray,
    ...FONTS.inter_500_18_19,
  },

  field_label: {
    color: COLORS.darkGray,
    ...FONTS.nunito_400_14_14,
  },

  field_text: {
    color: COLORS.darkGray,
    ...FONTS.nunito_400_14_14,
  },

  table_header: {
    color: COLORS.darkGray,
    ...FONTS.nunito_400_14_14,
  },

  table_row: {
    color: COLORS.darkGray,
    ...FONTS.nunito_400_14_14,
  },
};