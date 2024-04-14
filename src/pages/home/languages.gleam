import components
import core.{type Model}
import gleam/list
import gleam/option
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html
import util/icon.{Icon}

pub fn languages(model: Model) -> Element(core.Msg) {
  html.div([attribute.class("")], [
    components.title_text("Languages:", "text-center"),
    html.div(
      [
        attribute.class(
          "flex flex-row place-content-evenly bg-rose-200 p-2 mt-2 w-5/6 sm:w-2/3 m-auto rounded-lg",
        ),
      ],
      [
        Icon(icon: "nf-dev-rust", hover_color: "hover:text-red-600"),
        Icon(icon: "nf-dev-python", hover_color: "hover:text-violet-600"),
        Icon(icon: "nf-seti-lua", hover_color: "hover:text-indigo-400"),
        Icon(icon: "nf-custom-elixir", hover_color: "hover:text-purple-600"),
        Icon(icon: "nf-seti-go", hover_color: "hover:text-indigo-500"),
        Icon(icon: "nf-dev-haskell", hover_color: "hover:text-purple-600"),
        Icon(icon: "nf-cod-terminal_bash", hover_color: "hover:text-rose-900"),
        Icon(
          icon: "nf-dev-javascript_badge",
          hover_color: "hover:text-purple-600",
        ),
      ]
        |> list.map(fn(x) { icon.render_button(x, core.SetLanguage("rust")) }),
    ),
    html.p([], [
      html.text(option.unwrap(
        model.selected_language,
        "Click on a language to see more detailed information",
      )),
    ]),
  ])
}
