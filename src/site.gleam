import gleam/list
import gleam/option.{type Option, None, Some}
import lustre
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

type Icon {
  Icon(icon: String, hover_color: String, link: String)
}

fn render_icon(icon: Icon) -> Element(a) {
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

fn title_text(title: String, extra_css: String) -> Element(a) {
  html.h1([attribute.class("text-rose-800 text-xl " <> extra_css)], [
    element.text(title),
  ])
}

type Project {
  Project(name: String, description: String)
}

fn projects() -> Element(a) {
  let project_html =
    [
      Project(
        "Radish",
        "A highly concurrent unix shell written in Gleam and Rust",
      ),
      Project(
        "Sakinyje",
        "A modern desktop app for learning languages via immersion which seamlessly integrates with Anki",
      ),
      Project("Anteater", "A TUI drawing app written in Python"),
      Project(
        "Bashtyped",
        "An early exploration of making optional typing for bash",
      ),
      Project(
        "This website",
        "My portfolio website, written entirely in Gleam.",
      ),
      Project(
        "Fishbang",
        "A fish plugin which emulates the various bash bang commands",
      ),
    ]
    |> list.map(project_to_html)

  html.div([], [title_text("Projects:", ""), ..project_html])
}

fn project_to_html(project: Project) -> Element(a) {
  html.div(
    [
      attribute.class(
        "bg-rose-200 p-3 rounded-lg max-w-80 m-3 shadow-sm transition-all duration-150 hover:shadow-md",
      ),
    ],
    [
      html.h2([attribute.class("text-rose-700 text-lg hover:underline")], [
        element.text(project.name),
      ]),
      html.p([attribute.class("text-rose-800")], [
        element.text(project.description),
      ]),
    ],
  )
}

pub fn main() {
  let app = lustre.simple(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
}

fn init(_) -> Model {
  Model(None, None)
}

pub type Msg {
  SetLanguage(String)
}

fn update(model: Model, msg: Msg) {
  case msg {
    SetLanguage(v) -> Model(..model, selected_language: Some(v))
  }
}

type Model {
  Model(selected_language: Option(String), selected_tool: Option(String))
}

fn view(model: Model) -> Element(Msg) {
  let socials =
    [
      Icon(
        icon: "nf-md-github",
        hover_color: "hover:text-rose-900",
        link: "https://github.com/BrewingWeasel",
      ),
      Icon(
        icon: "nf-md-linkedin",
        hover_color: "hover:text-fuchsia-600",
        link: "https://www.linkedin.com/in/finnian-brewer-208b162b5",
      ),
    ]
    |> list.map(render_icon)

  let tools =
    html.div([attribute.class("")], [
      title_text("Tools:", "text-center"),
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
          |> list.map(render_icon),
      ),
    ])

  let languages =
    html.div([attribute.class("")], [
      title_text("Languages:", "text-center"),
      html.div(
        [
          attribute.class(
            "flex flex-row place-content-evenly bg-rose-200 p-2 mt-2 w-5/6 sm:w-2/3 m-auto rounded-lg",
          ),
        ],
        [
          Icon(
            icon: "nf-dev-rust",
            hover_color: "hover:text-red-600",
            link: "https://github.com/BrewingWeasel",
          ),
          Icon(
            icon: "nf-dev-python",
            hover_color: "hover:text-violet-600",
            link: "https://github.com/BrewingWeasel",
          ),
          Icon(
            icon: "nf-seti-lua",
            hover_color: "hover:text-indigo-400",
            link: "https://github.com/BrewingWeasel",
          ),
          Icon(
            icon: "nf-custom-elixir",
            hover_color: "hover:text-purple-600",
            link: "https://github.com/BrewingWeasel",
          ),
          Icon(
            icon: "nf-seti-go",
            hover_color: "hover:text-indigo-500",
            link: "https://github.com/BrewingWeasel",
          ),
          Icon(
            icon: "nf-dev-haskell",
            hover_color: "hover:text-purple-600",
            link: "https://github.com/BrewingWeasel",
          ),
          Icon(
            icon: "nf-cod-terminal_bash",
            hover_color: "hover:text-rose-900",
            link: "https://github.com/BrewingWeasel",
          ),
          Icon(
            icon: "nf-dev-javascript_badge",
            hover_color: "hover:text-purple-600",
            link: "https://github.com/BrewingWeasel",
          ),
        ]
          |> list.map(render_icon),
      ),
    ])

  html.div([attribute.class("dark")], [
    html.head([], [
      html.title([], "Hello!"),
      html.link([
        attribute.rel("stylesheet"),
        attribute.href("static/styles.css"),
      ]),
    ]),
    header(),
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
        html.p([attribute.class("text-rose-900 text-md mx-4 ")], [
          element.text(
            "I'm a 16-year-old self-taught programmer from Portland, Oregon. I'm interested in languages, linux, terminals and functional programming. When I get the chance, I love reading, running and backpacking. I write rust in neovim in a wayland tiling window manager on Arch, btw.",
          ),
        ]),
        html.hr([attribute.class("border-rose-900 border-1 mx-4 mt-2")]),
        languages,
        tools,
      ]),
      html.div([], [projects()]),
    ]),
  ])
}
