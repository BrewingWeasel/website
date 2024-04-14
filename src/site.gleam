import core.{type Model, type Msg, Model}
import gleam/option.{None, Some}
import lustre
import lustre/element.{type Element}
import pages/home

pub fn main() {
  let app = lustre.simple(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
}

fn init(_) -> Model {
  Model(None, None)
}

fn update(model: Model, msg: Msg) {
  case msg {
    core.SetLanguage(v) -> Model(..model, selected_language: Some(v))
    core.SetTool(v) -> Model(..model, selected_tool: Some(v))
  }
}

fn view(model: Model) -> Element(Msg) {
  home.page(model)
}
