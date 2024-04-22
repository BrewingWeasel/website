import core
import gleam/list
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html
import pages/blog/this_website

pub fn list_posts() -> Element(a) {
  let posts = [
    // blog posts here
    #("This Website", "this_website"),
  ]

  html.div(
    [],
    list.map(posts, fn(x) {
      html.a([attribute.href("blog/" <> x.1)], [element.text(x.0)])
    }),
  )
}

pub fn page(model: core.BlogPost) -> Element(core.Msg) {
  case model {
    core.ThisWebsite -> this_website.page()
  }
}

pub fn from_string(post: String) -> core.BlogPost {
  case post {
    "this_website" -> core.ThisWebsite
    _ -> panic as "unknown post"
  }
}
