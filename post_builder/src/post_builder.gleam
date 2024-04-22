import gleam/list
import gleam/option.{type Option}
import gleam/result
import gleam/string
import justin
import parser.{Command, ListV, Str}
import shared.{type Html}
import simplifile

pub fn main() {
  "../posts"
  |> simplifile.get_files()
  |> result.unwrap([])
  |> list.map(parse_file)
  |> list.map(gen_contents_from_ast(_, Contents(option.None, option.None, [])))
  |> list.map(gen_blog_from_contents)
}

type Contents {
  Contents(title: Option(String), tags: Option(List(String)), html: List(Html))
}

fn parse_file(file_name: String) -> List(parser.Ast) {
  let assert Ok(conts) = simplifile.read(file_name)
  let assert Ok(parsed) = parser.parse_all(conts, [])
  parsed
}

fn gen_blog_from_contents(contents: Contents) {
  let title = option.unwrap(contents.title, "Untitled Blog Post")
  let lustre_code = "import lustre/element/html
import lustre/attribute
import core
import components
import lustre/element.{type Element}
import shared.{type Html, P, Br, CodeSample, SectionHeader, Link}

pub fn page() -> Element(core.Msg) {
   html.div([], [
      components.header(),
      components.blog_title(\"" <> title <> "\"),
      components.blog_post(" <> string.inspect(contents.html) <> "),
   ])
}"

  let _ =
    simplifile.write(
      contents: lustre_code,
      to: "../site/src/pages/blog/" <> justin.snake_case(title) <> ".gleam",
    )

  let main_blog_file = "../site/src/pages/blog.gleam"

  let _ =
    main_blog_file
    |> simplifile.read()
    |> result.unwrap("")
    |> string.replace("// blog posts here", "// blog posts here
    #(\"" <> title <> "\", \"" <> justin.snake_case(title) <> "\"),")
    |> string.replace("case model {", "case model {
    core." <> justin.pascal_case(title) <> " -> " <> justin.snake_case(title) <> ".page()")
    |> string.replace("case post {", "case post {
    \"" <> justin.snake_case(title) <> "\" -> core." <> justin.pascal_case(
      title,
    ))
    |> string.replace("import core", "import core
import pages/blog/" <> justin.snake_case(title))
    |> simplifile.write(to: main_blog_file)

  let core_file = "../site/src/core.gleam"

  let _ =
    core_file
    |> simplifile.read()
    |> result.unwrap("")
    |> string.replace("type BlogPost {", "type BlogPost {
  " <> justin.pascal_case(title))
    |> simplifile.write(to: core_file)
}

fn gen_contents_from_ast(ast: List(parser.Ast), contents: Contents) -> Contents {
  case ast {
    [current, ..rest] -> {
      case current {
        Command("title", [Str(title)]) ->
          gen_contents_from_ast(
            rest,
            Contents(..contents, title: option.Some(title)),
          )
        Command("tags", [ListV(tags)]) -> {
          gen_contents_from_ast(
            rest,
            Contents(
              ..contents,
              tags: option.Some(
                list.map(tags, fn(x) {
                  let assert Str(v) = x
                  v
                }),
              ),
            ),
          )
        }
        Str(v) ->
          gen_contents_from_ast(
            rest,
            Contents(..contents, html: [shared.P(v), ..contents.html]),
          )
        html_element -> {
          let newest_html = case html_element {
            Command("p", [Str(v)]) -> shared.P(v)
            Command("sectionHeader", [Str(v)]) -> shared.SectionHeader(v)
            Command("codeSample", [Str(v)]) -> shared.CodeSample(v)
            Command("href", [Str(name), Str(site)]) -> shared.Link(name, site)
            Command("br", []) -> shared.Br
            _ -> panic as "Invalid"
          }
          gen_contents_from_ast(
            rest,
            Contents(..contents, html: [newest_html, ..contents.html]),
          )
        }
      }
    }
    [] -> contents
  }
}
