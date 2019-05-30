import paho.mqtt.client as mqtt
import time
import datetime
import pytz
import dateutil.parser
import json
import requests
import random


def createPacket(deviceToken, sensor, timestamp, valor):

	packet = {"deviceToken" : deviceToken, "sensor" : sensor, "timestamp" : timestamp, "valor" : valor}

	return packet

deviceToken = "fqhsnpf80w6lm1rfc8v8"

sensor1 = "Temperatura"
timestamp1 = str(datetime.datetime.now())[:-3] + "Z"
valor1 = 45

sensor2 = "Som"
timestamp2 = str(datetime.datetime.now())[:-3] + "Z"
valor2 = 22

sensor3 = "Luminosidade"
timestamp3 = str(datetime.datetime.now())[:-3] + "Z"
valor3 = 66

############## API WEB #######################

#packetTemperatura = createPacket(deviceToken, sensor1, timestamp1, valor1);
#packetSom = createPacket(deviceToken, sensor2, timestamp2, valor2);
#packetLuminosidade = createPacket(deviceToken, sensor3, timestamp3, valor3);


while True:

	allTimeStamp = str(datetime.datetime.utcnow().replace(microsecond=0).isoformat()) + ".000Z"

	valueR1 = random.randint(20,30)
	valueR2 = random.randint(20,80)
	valueR3 = random.randint(20,800)

	packetTemperatura = createPacket(deviceToken, sensor1, allTimeStamp, valueR1);
	packetSom = createPacket(deviceToken, sensor2, allTimeStamp, valueR2);
	packetLuminosidade = createPacket(deviceToken, sensor3, allTimeStamp, valueR3);

	print "Enviando Post"
	r = requests.post("http://localhost:1880/postData", json={'post': [packetTemperatura, packetSom, packetLuminosidade]})
	time.sleep(2) # Delay for 1 minute (60 seconds).

# One data
#r = requests.post("http://localhost:1880/postData", json={'post': [packetTemperatura]})

# More than one data
#r = requests.post("http://localhost:1880/postData", json={'post': [packetTemperatura, packetSom, packetLuminosidade]})

# Edit known data in database
#old = { "timestamp" : "2019-05-30 13:53:56.015Z", "valor" : 33}		# Old Data has to be exactly the same data of the database.
#new = { "timestamp" : timestamp1, "valor" : 123}
#r = requests.put("http://localhost:1880/updateDeviceData/" + deviceToken + "/" + sensor1, json={'old' : old, 'new' : new})

############## MQTT ##########################

# temperatura_topic = "/dispositivo1/temperatura"
# som_topic = "/dispositivo1/som"
# luminosidade_topic = "/dispositivo1/luminosidade"
# broker_url = "127.0.0.1"

# def mqtt_client_connect():
#     print("conectando ao broker: ", broker_url)
#     client.connect(broker_url)		#Conecta ao broker de mensagens
#     client.loop_start()				#Inicia loop

# client = mqtt.Client("Raspberry")	#Cria nova instancia
# mqtt_client_connect()			 	#Chama funcao para conectar ao broker

# n = 0


# packetTemperatura = createPacket(deviceToken, sensor1, timestamp1, valor1);
# packetSom = createPacket(deviceToken, sensor2, timestamp2, valor2);
# packetLuminosidade = createPacket(deviceToken, sensor3, timestamp3, valor3);

# data_Temp=json.dumps(packetTemperatura)  # encode object to JSON
# data_Som =json.dumps(packetSom)  		 # encode object to JSON
# data_Lum =json.dumps(packetLuminosidade) # encode object to JSON

# while True:

# 	# Note that sometimes you won't get a reading and
# 	# the results will be null (because Linux can't
# 	# guarantee the timing of calls to read the sensor).
# 	# If this happens try again!
# 	if data_Temp is not None and data_Som is not None and data_Lum is not None:
# 		print("Publicando no Topico {} : {}*C").format( temperatura_topic, data_Temp )
# 		print("Publicando no Topico {} : {}db").format( temperatura_topic, data_Som )
# 		print("Publicando no Topico {} : {}lum").format( temperatura_topic, data_Lum )

# 		client.publish(temperatura_topic, data_Temp)		#publica o dado no topico Temperatura
# 		client.publish(som_topic, data_Som)					#publica o dado no topico Som
# 		client.publish(luminosidade_topic, data_Lum)		#publica o dado no topico Luminosidade
# 	else:
#     		print('Failed to get reading. Try again!')

# 	time.sleep(10)
