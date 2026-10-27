import { createCn } from "cn/config";

/**
 * OHC 테마 키를 아는 cn(). 이게 없으면 text-body-small(글자 크기)과
 * text-primary-text(글자 색)를 같은 그룹으로 보고 하나를 지운다.
 * shadcn으로 컴포넌트를 추가하면 `from "cn"`으로 생성되니 `@/utils/cn`으로 바꾼다.
 */
export const cn = createCn({
  extend: {
    theme: {
      text: [
        "display-large",
        "display-medium",
        "heading-1",
        "heading-2",
        "heading-3",
        "title",
        "body-large",
        "body-medium",
        "body-small",
        "label-large",
        "label-medium",
        "label-small",
        "caption",
        "overline",
        "numeric-large",
        "numeric-medium",
        "numeric-small",
        "code-medium",
        "code-small",
      ],
      radius: ["button", "input", "card", "badge", "sheet", "avatar"],
      shadow: ["elevation-1", "elevation-2", "elevation-3", "focus"],
      spacing: ["page-margin", "gutter", "section-gap", "stack-gap", "card-padding"],
    },
  },
});
