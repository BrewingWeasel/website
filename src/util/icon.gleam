import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html

pub type Icon {
  Icon(icon: String, hover_color: String, link: String)
}

pub fn render(icon: Icon) -> Element(a) {
  html.a(
    [
      attribute.href(icon.link),
      attribute.target("_blank"),
      attribute.class(
        "text-rose-700 hover:-translate-y-0.5 transition-transform ease-in-out delay-50 duration-150 "
        <> icon.hover_color,
      ),
    ],
    [
      html.i(
        [attribute.class("text-inherit text-xl sm:text-3xl nf " <> icon.icon)],
        [],
      ),
    ],
  )
}
