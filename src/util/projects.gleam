import components
import gleam/list
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html

pub type Project {
  Project(name: String, description: String)
}

pub fn render_all() -> Element(a) {
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

  html.div([], [components.title_text("Projects:", ""), ..project_html])
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
