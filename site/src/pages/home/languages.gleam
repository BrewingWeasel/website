import components
import core.{type MainPageModel}
import gleam/list
import gleam/option
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html
import util/icon.{Icon}

pub fn languages(model: MainPageModel) -> Element(core.Msg) {
  html.div([attribute.class("")], [
    components.title_text("Languages:", "text-center"),
    html.div(
      [attribute.class("p-2 bg-rose-200 mt-2 w-5/6 sm:w-2/3 m-auto rounded-lg")],
      [
        html.div(
          [attribute.class("flex flex-row place-content-evenly")],
          [
            #(
              Icon(icon: "nf-dev-rust", hover_color: "hover:text-red-600"),
              "At this point, Rust is the language I have the most experience with. It took me a while to get used to the borrow checker, but now most projects I make have at least some rust. I'm simply in love with the language. Two of my biggest projects, Sakinyje and Radish, use rust to some degree.",
            ),
            #(
              Icon(icon: "nf-dev-python", hover_color: "hover:text-yellow-600"),
              "Python was the first language I used, and I'm still a fan of it today. Although I don't use it as much as I used to, I still write some scripts in it and keep track of the ecosystem.",
            ),
            #(
              Icon(icon: "nf-seti-lua", hover_color: "hover:text-indigo-400"),
              "Lua is a language that I have relatively little experience with, but it is extremely intuitive. My main knowledge comes from configuration written for Neovim and scripts I made for Davinci Resolve.",
            ),
            #(
              Icon(
                icon: "nf-custom-elixir",
                hover_color: "hover:text-purple-600",
              ),
              "Elixir is one of my favorite languages, though I haven't used it a ton. However, I find it intuitive due to my previous functional programming experience, and it's certainly a joy to write. My knowledge of Erlang from Gleam also helps.",
            ),
            #(
              Icon(icon: "nf-seti-go", hover_color: "hover:text-indigo-400"),
              "Go is the first lower-level language that I managed to learn. The over-simplification of everything is certainly annoying, but it does make me more productive. I've written a lot of concurrent programs and scrapers in Go.",
            ),
            #(
              Icon(icon: "nf-dev-haskell", hover_color: "hover:text-purple-600"),
              "I took the University of Helsinki Haskell MOOC, so I have a decent amount of experience with it. I haven't written much in Haskell since, but the principals have proven invaluable in other languages. Plus, now I know what a monad is.",
            ),
            #(
              Icon(
                icon: "nf-cod-terminal_bash",
                hover_color: "hover:text-slate-900",
              ),
              "I love writing shell scripts. I learned a lot about bash (and posix sh) in my projects to make a shell, to compile a language to posix sh, andm y bash typing system.",
            ),
            #(
              Icon(
                icon: "nf-dev-javascript_badge",
                hover_color: "hover:text-yellow-600",
              ),
              "Javascript was the second language I learned. It's not my favorite language, but it's certainly useful.",
            ),
          ]
            |> list.map(fn(x) { icon.render_button(x.0, core.SetLanguage(x.1)) }),
        ),
        html.p([attribute.class("text-rose-900 m-1 pt-2 text-center")], [
          html.text(option.unwrap(
            model.selected_language,
            "Click on a language to see more detailed information",
          )),
        ]),
      ],
    ),
  ])
}
