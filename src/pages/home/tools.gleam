import components
import core.{type Model}
import gleam/list
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html
import util/icon.{Icon}

pub fn tools(model: Model) -> Element(a) {
  html.div([attribute.class("")], [
    components.title_text("Tools:", "text-center"),
    html.div(
      [
        attribute.class(
          "flex flex-row place-content-evenly bg-rose-200 p-2 mt-2 w-5/6 sm:w-2/3 m-auto rounded-lg",
        ),
      ],
      [
        Icon(
          icon: "nf-dev-git",
          hover_color: "hover:text-red-600",
          link: "https://github.com/BrewingWeasel",
        ),
        Icon(
          icon: "nf-fa-linux",
          hover_color: "hover:text-red-600",
          link: "https://github.com/BrewingWeasel",
        ),
        Icon(
          icon: "nf-linux-neovim",
          hover_color: "hover:text-red-600",
          link: "https://github.com/BrewingWeasel",
        ),
        Icon(
          icon: "nf-linux-hyprland",
          hover_color: "hover:text-red-600",
          link: "https://github.com/BrewingWeasel",
        ),
        Icon(
          icon: "nf-cod-terminal",
          hover_color: "hover:text-red-600",
          link: "https://github.com/BrewingWeasel",
        ),
      ]
        |> list.map(icon.render),
    ),
  ])
}
