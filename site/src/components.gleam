import gleam/list
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html
import shared

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

pub fn blog_title(title: String) -> Element(a) {
  html.h1([attribute.class("text-rose-800 text-3xl")], [element.text(title)])
}

pub fn blog_post(contents: List(shared.Html)) -> Element(a) {
  html.div(
    [],
    list.map(contents, fn(x) {
      case x {
        shared.P(p) -> html.p([attribute.class("inline")], [element.text(p)])
        shared.CodeSample(code) ->
          html.p([attribute.class("inline")], [element.text(code)])
        shared.SectionHeader(title) -> title_text(title, "")
        shared.Link(link, text) ->
          html.a([attribute.href(link), attribute.class("inline")], [
            element.text(text),
          ])
        shared.Br -> html.br([])
      }
    }),
  )
}
