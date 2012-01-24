var statusDisplay = function (spec, my) {
    var that;
    my = my || {};
    
    that = new Container();

    that.x = spec.x || 0;
    that.y = spec.y || 0;
    
    var moneyText = new Text("0", "32px sans-serif", "#ffffff");
	moneyText.x = 10;
	moneyText.y = 30;
    that.addChild(moneyText);
    
    var populationText = new Text("0", "32px sans-serif", "#ffffff");
	populationText.x = 10;
	populationText.y = 80;
    that.addChild(populationText);
    
    var sickText = new Text("0", "32px sans-serif", "#ffffff");
	sickText.x = 10;
	sickText.y = 130;
    that.addChild(sickText);
    
    var infectedText = new Text("0", "32px sans-serif", "#ffffff");
	infectedText.x = 10;
	infectedText.y = 180;
    that.addChild(infectedText);

    that.tick = function () {
        moneyText.text = "" + Math.floor(spec.status.money);
        populationText.text = "" + Math.floor(spec.status.population);
        sickText.text = "" + Math.floor(spec.status.sick);
        infectedText.text = "" + Math.floor(spec.status.infected);
    }
    
    return that;
}