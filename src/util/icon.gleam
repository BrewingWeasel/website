import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html
import lustre/event

pub type Icon {
  Icon(icon: String, hover_color: String)
}

pub fn render_link(icon: Icon, link: String) -> Element(a) {
  html.a(
    [
      attribute.href(link),
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

pub fn render_button(icon: Icon, msg) -> Element(a) {
  html.i(
    [
      event.on_click(msg),
      attribute.class(
        "text-xl sm:text-3xl nf "
        <> icon.icon
        <> " text-rose-700 hover:-translate-y-0.5 transition-transform ease-in-out delay-50 duration-150 "
        <> icon.hover_color,
      ),
    ],
    [],
  )
}
