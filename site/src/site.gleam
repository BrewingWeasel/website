import core.{type Model, type Msg, MainPage}
import gleam/option.{None, Some}
import gleam/uri.{type Uri}
import lustre
import lustre/effect.{type Effect}
import lustre/element.{type Element}
import modem
import pages/blog
import pages/home

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
}

fn init(_) -> #(Model, Effect(Msg)) {
  #(new_main_page(), modem.init(on_url_change))
}

fn on_url_change(uri: Uri) -> Msg {
  case uri.path_segments(uri.path) {
    ["blog", v] -> core.OnRouteChange(core.Blog(v))
    _ -> core.OnRouteChange(core.Main)
  }
}

fn new_main_page() {
  MainPage(core.MainPageModel(None, None))
}

fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  #(
    case msg {
      core.SetLanguage(v) -> {
        let assert MainPage(model) = model
        MainPage(core.MainPageModel(..model, selected_language: Some(v)))
      }
      core.SetTool(v) -> {
        let assert MainPage(model) = model
        MainPage(core.MainPageModel(..model, selected_tool: Some(v)))
      }

      core.OnRouteChange(page) -> {
        case page {
          core.Blog(blog) -> core.BlogPage(blog.from_string(blog))
          core.Main -> new_main_page()
        }
      }
    },
    effect.none(),
  )
}

fn view(model: Model) -> Element(Msg) {
  case model {
    MainPage(model) -> home.page(model)
    core.BlogPage(model) -> blog.page(model)
  }
}
