import gleam/result
import gleam/string

pub type Ast {
  Command(command: String, args: List(Ast))
  ListV(conts: List(Ast))
  Str(conts: String)
}

pub type ParseError {
  MissingQuote
  MissingListEnd(String)
  UnexpectedFileEnd
  Other
}

pub type Parsing(t) {
  Parsing(remaining: String, value: t)
}

pub fn parse_all(input: String, acc: List(Ast)) -> Result(List(Ast), ParseError) {
  case string.trim_left(input) {
    "" -> Ok(acc)
    input ->
      case parse_expression(input) {
        Ok(Parsing(remaining: rest, value: v)) -> {
          parse_all(rest, [v, ..acc])
        }
        Error(e) -> Error(e)
      }
  }
}

pub fn parse_expression(input: String) -> Result(Parsing(Ast), ParseError) {
  case string.trim_left(input) {
    "\"" <> ending -> parse_string(ending)
    "(" <> call -> {
      use command <- result.try(parse_command(call, ""))
      use list <- result.try(parse_list(command.remaining, ")"))
      Ok(Parsing(list.remaining, Command(command.value, list.value)))
    }
    "[" <> call -> {
      use list <- result.try(parse_list(call, "]"))
      Ok(Parsing(list.remaining, ListV(list.value)))
    }
    _ -> Error(Other)
  }
}

pub fn parse_list(
  input: String,
  ending: String,
) -> Result(Parsing(List(Ast)), ParseError) {
  use parsed_list <- result.try(do_parse_list(input, ending, []))
  Ok(Parsing(parsed_list.remaining, parsed_list.value))
}

pub fn parse_command(
  input: String,
  acc: String,
) -> Result(Parsing(String), ParseError) {
  case string.pop_grapheme(input) {
    Ok(#(" ", _rest)) | Ok(#(")", _rest)) ->
      Ok(Parsing(remaining: input, value: acc))
    Ok(#(v, rest)) -> parse_command(rest, acc <> v)
    Error(_) -> {
      Error(UnexpectedFileEnd)
    }
  }
}

fn do_parse_list(
  input: String,
  ending: String,
  acc: List(Ast),
) -> Result(Parsing(List(Ast)), ParseError) {
  case string.pop_grapheme(string.trim_left(input)) {
    Ok(#(v, rest)) if v == ending -> Ok(Parsing(rest, acc))
    Ok(_) -> {
      use cur_elem <- result.try(parse_expression(input))
      do_parse_list(cur_elem.remaining, ending, [cur_elem.value, ..acc])
    }
    Error(_) -> Error(MissingListEnd(ending))
  }
}

pub fn parse_string(input: String) -> Result(Parsing(Ast), ParseError) {
  use next_part <- result.try(do_parse_string(string.to_graphemes(input), ""))
  Ok(Parsing(value: Str(next_part.value), remaining: next_part.remaining))
}

fn do_parse_string(
  input: List(String),
  acc: String,
) -> Result(Parsing(String), ParseError) {
  case input {
    ["\\", following, ..rest] -> {
      do_parse_string(
        rest,
        acc
          <> case following {
          "n" -> "\n"
          "t" -> "\t"
          "\\" -> "\\"
          x -> "\\" <> x
        },
      )
    }
    ["\"", ..rest] -> {
      Ok(Parsing(string.concat(rest), acc))
    }
    [v, ..rest] -> {
      do_parse_string(rest, acc <> v)
    }
    [] -> Error(MissingQuote)
  }
}
