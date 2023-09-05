import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONObject;
 
 public void enviarCoordenadasParaAPI() {
        try {
            OkHttpClient client = new OkHttpClient();
            Log.d("coordenadas", "Enviando coordenadas...");

            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);

            if (Verifica.gpsAtivo(ServicoCoordenadas.this)) {
                Log.d("coordenadas", "GPS: Habilitado");
            } else {
                Log.d("coordenadas", "GPS: Desabilitado");
            }

            GPS gps = new GPS(ServicoCoordenadas.this);
            Thread.sleep(5000);

            Geocoder gc = new Geocoder(ServicoCoordenadas.this);
            Address address = null;
            List<Address> addresses = gc.getFromLocation(gps.getLatitude(), gps.getLongitude(), 1);

            Log.d("coordenadas", "Locais: " + addresses.size());

            if (addresses.size() > 0) {
                address = addresses.get(0);
            }

            if (address != null) {

                double latitude = address.getLatitude();
                double longitude = address.getLongitude();
                String dataGPS = DateTime.getNow().toString("dd/MM/yyyy HH:mm:ss");

                JSONObject json = new JSONObject();
                json.put("EquipeId", Parametro.CodigoEquipe);
                json.put("EquipamentoId", Parametro.DispositivoId);
                json.put("Latitude", Double.toString(latitude));
                json.put("Longitude", Double.toString(longitude));
                json.put("DataCriacao", dataGPS.toString());
                json.put("DataRegistro", dataGPS.toString());
                json.put("Observacao", "Android");

                MediaType JSON = MediaType.parse("application/json; charset=utf-8");
                RequestBody body = RequestBody.create(JSON, json.toString());




                Request request = new Request.Builder()
                        .url("https://teste.cebicloud.com.br/gerenciamento_servicos/Api/Coletor/GravarEquipeEquipamentoCoordenada")
                        .put(body)
                        .build();

                Response response = client.newCall(request).execute();

                if (response.isSuccessful()) {
                    Log.d("enviarCoordenadasParaAPI", "Dados enviados com sucesso");
                } else {
                    Log.d("enviarCoordenadasParaAPI", "Erro na resposta: " + response.code());
                }
            } else {
                Log.d("enviarCoordenadasParaAPI", "Sem parâmetros disponíveis");
            }
        } catch (Exception e) {
            Log.d("enviarCoordenadasParaAPI", "Erro: " + e.getMessage());
        }
    }