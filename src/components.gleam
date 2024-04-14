import gleam/list
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html

pub fn header() -> Element(a) {
  html.nav([attribute.class("flex place-content-center")], [
    html.div(
      [
        attribute.class(
          "bg-rose-200 flex flex-row place-content-center w-fit py-1 px-3 space-x-5 rounded-b-lg",
        ),
      ],
      [#("about", "about"), #("other", "other"), #("cool", "cool")]
        |> list.map(fn(x) {
        html.a(
          [
            attribute.href(x.1),
            attribute.class("text-rose-700 hover:underline hover:text-pink-700"),
          ],
          [element.text(x.0)],
        )
      }),
    ),
  ])
}

pub fn title_text(title: String, extra_css: String) -> Element(a) {
  html.h1([attribute.class("text-rose-800 text-xl " <> extra_css)], [
    element.text(title),
  ])
}
