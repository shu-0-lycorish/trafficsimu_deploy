defmodule SampleDaisyuiWeb.PageController do
  use SampleDaisyuiWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
