import gleam/option.{type Option}

pub type Model {
  Model(selected_language: Option(String), selected_tool: Option(String))
}

pub type Msg {
  SetLanguage(String)
}
