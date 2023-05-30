import React, { useEffect, useState } from 'react';
import Heading from './Heading';
import Spinner from './Spinner';

const OddspediaWidget = () => {
	const [loading, setLoading] = useState(true);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://widgets.oddspedia.com/js/widget/init.js?widgetId=oddspediaWidgetLiveScorePopularSportsfootballtennisbasketballesportsbaseballmixedmartialartsboxingLeagues';
        script.async = true;

        window.oddspediaWidgetLiveScorePopularSportsfootballtennisbasketballesportsbaseballmixedmartialartsboxingLeagues = {
			api_token: "d0351255c5083f8f24be3cfb50f6818914276e36f8fe2e51b2fb49a2e72d",
			type: "live-score",
			domain: "playerpicks.mx",
			selector: "oddspedia-widget-live-score-popular-false-sports-football-tennis-basketball-esports-baseball-mixed-martial-arts-boxing-leagues-false",
			theme: "0",
			odds_type: "2",
			language: "es",
			primary_color: "#2C2E3E",
			accent_color: "#D93E46",
			font: "Lato",
			logos: "true",
			inplay_only: "true",
			extended_match_info: "true",
			live_stream: "false",
			limit: "10",
			popular: "false",
			sports: "football,tennis,basketball,esports,baseball,mixed-martial-arts,boxing",
			leagues: "",
		};

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

	return (
		<>
		  <Heading title="Resultados en vivo" logo />
			<div id="oddspedia-widget-live-score-popular-false-sports-football-tennis-basketball-esports-baseball-mixed-martial-arts-boxing-leagues-false">
			  {/* The third-party widget will be loaded here */}
			</div>
		</>
	  );
};

export default OddspediaWidget;

/*
			<div id="oddspedia-widget-live-score-popular-false-sports-football-tennis-basketball-esports-baseball-mixed-martial-arts-boxing-leagues-false">
			<script>
			window.oddspediaWidgetLiveScorePopularSportsfootballtennisbasketballesportsbaseballmixedmartialartsboxingLeagues = {
				api_token: "d0351255c5083f8f24be3cfb50f6818914276e36f8fe2e51b2fb49a2e72d",
				type: "live-score",
				domain: "localhost:3000/",
				selector: "oddspedia-widget-live-score-popular-false-sports-football-tennis-basketball-esports-baseball-mixed-martial-arts-boxing-leagues-false",
				width: "360",
				theme: "0",
				odds_type: "2",
				language: "es",
				primary_color: "#2C2E3E",
				accent_color: "#D93E46",
				font: "Lato",
				logos: "true",
				inplay_only: "true",
				extended_match_info: "true",
				live_stream: "false",
				limit: "10",
				popular: "false",
				sports: "football,tennis,basketball,esports,baseball,mixed-martial-arts,boxing",
				leagues: "",
			};
			</script>
			<script src="https://widgets.oddspedia.com/js/widget/init.js?widgetId=oddspediaWidgetLiveScorePopularSportsfootballtennisbasketballesportsbaseballmixedmartialartsboxingLeagues" async></script>
			</div>
			
			 */