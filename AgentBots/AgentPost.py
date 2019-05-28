# this script is to be run every 1 hr or something.
# It sends a POST request to the server's dataPost to let the server store the data.


# importing the requests library 
import requests 
  
# defining the api-endpoint  
API_ENDPOINT = "http://localhost/dataPost"
  
# your API key here 
API_KEY = "XXXXXXXXXXXXXXXXX"
  
# your source code here 
source_code = ''' 
print("Hello, world!") 
a = 1 
b = 2 
print(a + b) 
'''
  
# data to be sent to api 
data = {
	"signature": 1,
	"timeStamp": 3,
	"dataType": "humidity",
	"dataValue": 12
}
  
# sending post request and saving response as response object 
r = requests.post(url = API_ENDPOINT, data = data) 

# extracting response text  
pastebin_url = r.text 
print("The pastebin URL is:%s"%pastebin_url) 