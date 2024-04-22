import components
import core
import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html
import shared.{type Html, Br, CodeSample, Link, P, SectionHeader}

pub fn page() -> Element(core.Msg) {
  html.div([], [
    components.header(),
    components.blog_title("This Website"),
    components.blog_post([
      SectionHeader("The basics"),
      P("This site was made with "),
      Link("https://gleam.run/", "gleam"),
      P(" and "),
      Link("https://lustre.build/", "lustre"),
      P(". The entirety of the styling was done using Tailwind."),
      Br,
      P(
        "All three of these projects together formed a solid stack. Gleam's language design in particular leads to some really nice code.",
      ),
      CodeSample("# nice code when I think of some"),
      P(
        "Lustre was also nice and intuitive. My only real problem was a lack of a templating language, which lead to some rather ugly code. On the other hand, that made simply breaking parts into other functions trivial.",
      ),
      SectionHeader("The blog"),
    ]),
  ])
}
