import sys

from odoo.service import common
from odoo.exceptions import Warning

from . import controllers
from . import models


def pre_init_check(cr):
    version_info = common.exp_version()
    server_series = version_info.get("server_serie")
    if server_series != "15.0":
        raise Warning("Module support Odoo series 15.0 found {}".format(server_series))

    # TODO: We need Python 3.5+ for "easy" bytes-hex encoding, is this okay?
    if sys.version_info < (3, 5):
        raise ImportError("This module needs Python 3.5+")
    return True

