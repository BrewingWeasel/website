import components
import core.{type Model}
import gleam/list
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html
import pages/home/languages.{languages}
import pages/home/tools.{tools}
import util/icon.{Icon}
import util/projects

pub fn page(model: Model) -> Element(core.Msg) {
  let socials =
    [
      #(
        Icon(icon: "nf-md-github", hover_color: "hover:text-rose-900"),
        "https://github.com/BrewingWeasel",
      ),
      #(
        Icon(icon: "nf-md-linkedin", hover_color: "hover:text-fuchsia-600"),
        "https://www.linkedin.com/in/finnian-brewer-208b162b5",
      ),
    ]
    |> list.map(fn(x) { icon.render_link(x.0, x.1) })

  html.div([attribute.class("dark")], [
    components.header(),
    html.div([attribute.class("flex flex-col sm:flex-row")], [
      html.div([attribute.class("sm:w-2/3 w-full sm:ml-4 flex flex-col")], [
        html.div([attribute.class("flex space-x-2 mr-4 items-baseline")], [
          html.h1(
            [attribute.class("text-rose-800 text-6xl m-2 font-bold grow")],
            [element.text("Labas!")],
          ),
          ..socials
        ]),
        html.br([]),
        html.p([attribute.class("text-rose-900 text-md mx-4")], [
          element.text(
            "I'm a 16-year-old self-taught programmer from Portland, Oregon. I'm interested in languages, linux, terminals and functional programming. When I get the chance, I love reading, running and backpacking. I write rust in neovim in a wayland tiling window manager on Arch, btw.",
          ),
        ]),
        html.hr([attribute.class("border-rose-900 border-1 mx-4 my-3")]),
        languages(model),
        tools(model),
      ]),
      html.div([], [projects.render_all()]),
    ]),
  ])
}
