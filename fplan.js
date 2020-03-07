$(document).ready(function(){
    moment.locale('en');
    var now = moment();

    /**
     * Many events
     */
    var events = [
    {
       start: now.startOf('week').add(3, 'days').add(12, 'h').format('X'),
       end: now.startOf('week').add(3, 'days').add(14, 'h').add(30, 'm').format('X'),
       title: 'Analisis 3',
       content: 'Acero',
       category:'AM3'
     },  
     {
       start: now.startOf('week').add(5, 'days').add(12, 'h').format('X'),
       end: now.startOf('week').add(5, 'days').add(14, 'h').add(30, 'm').format('X'),
       title: 'Analisis 3',
       content: 'Acero',
       category:'AM3'
     },
     {
       start: now.startOf('week').add(4, 'days').add(9, 'h').format('X'),
       end: now.startOf('week').add(4, 'days').add(11, 'h').add(30, 'm').format('X'),
       title: 'Algoritmos X',
       content: 'Rosita',
       category:'Algo2'
     },  
     {
       start: now.startOf('week').add(2, 'days').add(9, 'h').format('X'),
       end: now.startOf('week').add(2, 'days').add(11, 'h').add(30, 'm').format('X'),
       title: 'Algoritmos X',
       content: 'Rosita',
       category:'Algo2'
     },

    ];

    var daynotes = [
      {
        time: now.startOf('week').add(15, 'h').add(30, 'm').format('X'),
        title: 'Leo\'s holiday',
        content: 'yo',
        category: 'holiday'
      }
    ];

    var calendar = $('#calendar').Calendar({
      locale: 'es',
      weekday: {
        timeline: {
          fromHour: 4
        },
        dayline: {
          format: "dddd"
        }
      },
      events: events,
      daynotes: daynotes
    }).init();

  });