locals {
    file_name = "./lambda/${var.function_name}.js"
    zipe_file_name = "${local.file_name}.zip"
    handler = "${var.function_name}.handler"
}
