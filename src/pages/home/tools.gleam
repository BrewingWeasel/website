import components
import core.{type Model}
import gleam/list
import gleam/option
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html
import util/icon.{Icon}

pub fn tools(model: Model) -> Element(core.Msg) {
  html.div([], [
    components.title_text("Tools:", "text-center"),
    html.div(
      [attribute.class("p-2 bg-rose-200 mt-2 w-5/6 sm:w-2/3 m-auto rounded-lg")],
      [
        html.div(
          [attribute.class("flex flex-row place-content-evenly")],
          [
            #(
              Icon(icon: "nf-dev-git", hover_color: "hover:text-red-600"),
              "I use the git cli daily to manage all of my projects, most of which are on github. ",
            ),
            #(
              Icon(icon: "nf-fa-linux", hover_color: "hover:text-red-600"),
              "I've been using linux for around a year and a half, and I've experimented with many distros and desktop environments. I'm currently using Arch (btw)",
            ),
            #(
              Icon(icon: "nf-linux-neovim", hover_color: "hover:text-red-600"),
              "Soon after I switched to linux, I began using neovim. These days it's the only editor I use, and I made a complete configuration from scratch.",
            ),
            #(
              Icon(icon: "nf-linux-hyprland", hover_color: "hover:text-red-600"),
              "Hyprland has been my go-to window manager for a long time now. I've customized it with vim-style keybinds and setting it up taught me a lot about Linux and Wayland.",
            ),
            #(
              Icon(icon: "nf-cod-terminal", hover_color: "hover:text-red-600"),
              "When I first started programming on Windows, I was terrified of the shell. These days however, I spend as much time as possible in my terminal (currently Kitty).",
            ),
          ]
            |> list.map(fn(x) { icon.render_button(x.0, core.SetTool(x.1)) }),
        ),
        html.p([attribute.class("text-rose-900 m-1 pt-2 text-center")], [
          html.text(option.unwrap(
            model.selected_tool,
            "Click on a tool to see more detailed information",
          )),
        ]),
      ],
    ),
  ])
}
