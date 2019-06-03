function createConfigLine(labelLine, textLine, labelX, labelY, colorChart) 
{
  var config_line = 
  {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: labelLine,
        backgroundColor: colorChart,
        borderColor: colorChart,
        data: [],
        fill: false,
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: textLine
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          type: 'time',
          ticks: {
            minRotation: 90,
        	autoSkip: true,
        	maxTicksLimit: 10,
            source: 'data'  
          },
          distribution: 'series',
          display: true,
          scaleLabel: {
            display: true,
            labelString: labelX
          }
        }],
        yAxes: [{
          display: true,

          scaleLabel: {
            display: true,
            labelString: labelY
          }
        }]
      }
    }
  };

  return config_line;
}

var config_lines = [];
config_lines.push( createConfigLine('Temperatura', '', 'Hora', '( ºC ) Graus Celcius', window.chartColors.red) );
config_lines.push( createConfigLine('Nível de Ruído', '', 'Hora', '( db ) Decibéis', window.chartColors.purple) );
config_lines.push( createConfigLine('Luminosidade', '', 'Hora', '( lm ) Lummens', window.chartColors.yellow) );


var windowLines = [];
var mqtt_lines = [];
mqtt_lines.push( createConfigLine('Temperatura MQTT', '', 'Hora', '( ºC ) Graus Celcius', window.chartColors.red) );
mqtt_lines.push( createConfigLine('Nível de Ruído MQTT', '', 'Hora', '( db ) Decibéis', window.chartColors.purple) );
mqtt_lines.push( createConfigLine('Luminosidade MQTT', '', 'Hora', '( lm ) Lummens', window.chartColors.yellow) );

var lastEntrys = [];
var update = false;

lastEntryF1 = null;
lastEntryF2 = null;
lastEntryF3 = null;

sensors = ["Temperatura", "Som", "Luminosidade"];

deviceToken = "r2334t24djeb1ku3o4j84";

/*cria os graficos com os ultimos valores enviados para o thingspeak */
function createMyLine2() 
{
  var ctx1 = document.getElementById('canvas1').getContext('2d');
  window.myLine1 = new Chart(ctx1, config_lines[0]);

  var ctx2 = document.getElementById('canvas2').getContext('2d');
  window.myLine2 = new Chart(ctx2, config_lines[1]);

  var ctx3 = document.getElementById('canvas3').getContext('2d');
  window.myLine3 = new Chart(ctx3, config_lines[2]);

  // CREATE MQTT CHARTS

  var mqtt1 = document.getElementById('mqttcanvas1').getContext('2d');
  window.mqttLine1 = new Chart(mqtt1, mqtt_lines[0]);
  windowLines.push(window.mqttLine1);

  var mqtt2 = document.getElementById('mqttcanvas2').getContext('2d');
  window.mqttLine2 = new Chart(mqtt2, mqtt_lines[1]);
  windowLines.push(window.mqttLine2);

  var mqtt3 = document.getElementById('mqttcanvas3').getContext('2d');
  window.mqttLine3 = new Chart(mqtt3, mqtt_lines[2]);
  windowLines.push(window.mqttLine3);

  isDeprecated();
};

function isDeprecated()
{
  $.getJSON('http://localhost:1880/getDeviceData/' + deviceToken, function(data) 
  {

    /*console.log('LastEntry: ');
    console.log(lastEntry);
    console.log('Data LastEntry: ');
    console.log(data.channel.last_entry_id);*/

    endEntrys = [];

    for(var i = 0; i < sensors.length; i++)
    {
	    endEntrys[i] = (data[sensors[i]].length) - 1;
    }
    for(var i = 0; i < sensors.length; i++)
    {
	    //console.log('LastEntry: ');
	    //console.log(lastEntrys[i]);

	    //console.log('LastEntry BD: ');
	    //console.log(data[sensors[i]][endEntrys[i]]);

	    if( lastEntrys[i] != null )
	    {
	    	if( lastEntrys[i].timestamp != data[sensors[i]][endEntrys[i]].timestamp )
			{
				//lastEntry = data.channel.last_entry_id;
				getUpdateDatas();
			}
	    }
	    else
	    {
				getUpdateDatas();
	    }

		
    }



  });

  // Atualizando a cada 2000 ms 
  setTimeout(isDeprecated, 2000);
}

function getUpdateDatas()
{ 
  getLastThingSpeakData(0);
  getLastThingSpeakData(1);
  getLastThingSpeakData(2);
}

/*
* requisita os ultimos dados enviados para o thingspeak
* e atualiza os valores no grafico
*/
function getLastThingSpeakData(line)
{  
  var field_number = line; //numero do field

  $.getJSON('http://localhost:1880/getDeviceData/' + deviceToken, function(data) 
  {
    // get the data point
    feeds = data;

      /*if(!firstUpdate)
      {
        // clear dataset
        config_lines[line].data.datasets[0].data = [];
        config_lines[line].data.labels = [];
      }*/

    //console.log('Atualizar');
    //console.log(field_number);
    // imprime os feeds recebidos
    /*console.log('Feeds: ');
    console.log(feeds);*/
    
    //console.log('Data: ');
    //console.log(feeds);

	for(d in feeds[sensors[field_number]] )
	{
		obj = feeds[sensors[field_number]][d];

		if(obj != null)
		{
			if( lastEntrys[field_number] == null || new Date(lastEntrys[field_number].timestamp).getTime() < new Date(obj.timestamp).getTime() )
			{
				config_lines[field_number].data.datasets[0].data.push(obj.valor);

				//variavel config_line1.labels eh equivalente ao eixo x
				var x_date = new Date(obj.timestamp);
				config_lines[field_number].data.labels.push(x_date);

				lastEntrys[field_number] = obj;

				switch(field_number)
				{
					case 0:
						window.myLine1.update();
					break;

					case 1:
						window.myLine2.update();
					break;

					case 2:
						window.myLine3.update();
					break;

				}
			}
		}
	}

  });  
}

// Create a client instance
client = new Paho.MQTT.Client("127.0.0.1", 8080, "FrontEndIoT");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect, onFailure:onFailConnect});

// called when the client connects
function onFailConnect() 
{
  // Once a connection has been made, make a subscription and send a message.
  console.log("Erro de conexão.");
}
  
// called when the client connects
function onConnect() 
{
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  
  client.subscribe("/dispositivo1/temperatura");
  client.subscribe("/dispositivo1/som");
  client.subscribe("/dispositivo1/luminosidade");
  
  /*message = new Paho.MQTT.Message("Hello");
  message.destinationName = "World";
  client.send(message);*/
}

// called when the client loses its connection
function onConnectionLost(responseObject)
{
  if (responseObject.errorCode !== 0)
  {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message)
{
	topico = message.destinationName;
	topico = topico.replace("/dispositivo1/","");

	objMessage = JSON.parse(message.payloadString);

	chart = -1;

	switch(topico)
	{
		case "temperatura":
			chart = 0;
			console.log("TEMPERATURA");
		break;

		case "som":
			chart = 1;
			console.log("SOM");
		break;

		case "luminosidade":
			chart = 2;
			console.log("LUMINOSIDADE");
		break;
	}

	if(chart >= 0)
	{
		mqtt_lines[chart].data.datasets[0].data.push(objMessage.valor);

		//variavel config_line1.labels eh equivalente ao eixo x
		var x_date = new Date(objMessage.timestamp);
		mqtt_lines[chart].data.labels.push(x_date);

		windowLines[chart].update();
	}

  //console.log("Topico:" + topico);
  //console.log("Mensagem:" + objMessage);
}