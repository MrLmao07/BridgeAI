from .headphones  import parse_headphones
from .laptops     import parse_laptops
from .tablets     import parse_tablets
from .smartphones import parse_smartphones
from .monitors    import parse_monitors
from .tvs         import parse_tvs


PARSER_MAP = {
    "casti":       parse_headphones,
    "laptopuri":   parse_laptops,
    "tablete":     parse_tablets,
    "smartphone":  parse_smartphones,
    "monitoare":   parse_monitors,
    "televizoare": parse_tvs,
}
