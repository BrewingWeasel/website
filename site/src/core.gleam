import gleam/option.{type Option}

pub type Route {
  Main
  Blog(String)
}

pub type Model {
  MainPage(MainPageModel)
  BlogPage(BlogPost)
}

pub type MainPageModel {
  MainPageModel(
    selected_language: Option(String),
    selected_tool: Option(String),
  )
}

pub type BlogPost {
  ThisWebsite
}

pub type Msg {
  OnRouteChange(Route)
  SetLanguage(String)
  SetTool(String)
}
