# WeatherWidget
This Angular JS widget is to display the weather details for any particular location based on the input.It uses yahoo api internally for data management.

#Launch <a href="https://vinusankart.github.io/WeatherWidget/app/widget/client.html" target="_blank">here</a>

Steps to configure:

1.Add the below line where you want to load the widget (ie: client file) and feed data-city,data-region as inputs to the widget in order to display corresponding data.
```html
<div  id="widgetContainer" data-city= "McLean" data-region="VA"></div>
```


2.Import the below line inside the '''<body> '''tag of client file followed by the above <div>.
```html
<script type="text/javascript" src="widget.js"></script>
```




