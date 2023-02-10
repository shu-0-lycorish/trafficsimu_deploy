defmodule SampleDaisyui.Repo do
  use Ecto.Repo,
    otp_app: :sample_daisyui,
    adapter: Ecto.Adapters.Postgres
end
