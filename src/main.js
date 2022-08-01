var app = ( function () {
  var canvas = document.getElementById( 'canvas' ),
      context = canvas.getContext( '2d' ),

      // API
      public = {};

      // Public methods goes here...
      public.loadPicture = function () {
          var imageObj = new Image();


          // Obtener referencia al input
          const selectorArchivos = document.querySelector("#seleccionArchivos");
          imageObj.src = "./img/image.jpg";

          // Escuchar cuando cambie
          selectorArchivos.addEventListener("change", () => {
              // Los archivos seleccionados, pueden ser muchos o uno
              const archivo = selectorArchivos.files;
              // Ahora tomamos el primer archivo, el cual vamos a previsualizar
              const primerArchivo = archivo[0];
              // Lo convertimos a un objeto de tipo objectURL
              const objectURL = URL.createObjectURL(primerArchivo);
              // Y a la fuente de la imagen le ponemos el objectURL
              imageObj.src = objectURL;
          });
          
          imageObj.onload = function () {                            
              if(imageObj.naturalWidth > 1920){
                  canvas.height = imageObj.naturalHeight/3;
                  canvas.width = imageObj.naturalWidth/3;
              } else if(imageObj.naturalWidth >= 1280){
                  canvas.height = imageObj.naturalHeight/2;
                  canvas.width = imageObj.naturalWidth/2;
              } else {
                  canvas.height = imageObj.naturalHeight;
                  canvas.width = imageObj.naturalWidth;
              }                            
              context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
          }
      };

      public.getImgData = function () {
          return context.getImageData( 0, 0, canvas.width, canvas.height );
      };

      // Filters
      public.filters = {};
      
      public.filters.bw = function () {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height;

          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];

              var grey = ( r + g + b ) / 3;

              pixels[ i * 4 ] = grey;
              pixels[ i * 4 + 1 ] = grey;
              pixels[ i * 4 + 2 ] = grey;
          }

          context.putImageData( imageData, 0, 0 );
      };

      public.filters.invert = function () {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height;
      
          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];
      
              pixels[ i * 4 ] = 255 - r;
              pixels[ i * 4 + 1 ] = 255 - g;
              pixels[ i * 4 + 2 ] = 255 - b;
          }
      
          context.putImageData( imageData, 0, 0 );
      };
      
      public.filters.sepia = function () {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height;
      
          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];
      
              pixels[ i * 4 ] = 255 - r;
              pixels[ i * 4 + 1 ] = 255 - g;
              pixels[ i * 4 + 2 ] = 255 - b;
      
              pixels[ i * 4 ] = ( r * .393 ) + ( g *.769 ) + ( b * .189 );
              pixels[ i * 4 + 1 ] = ( r * .349 ) + ( g *.686 ) + ( b * .168 );
              pixels[ i * 4 + 2 ] = ( r * .272 ) + ( g *.534 ) + ( b * .131 );
          }
      
          context.putImageData( imageData, 0, 0 );
      };
      
      let colorPicker = document.querySelector("#input-color");
      let color = "#000000";
      let colorRed = 00;
      let colorGreen = 00;
      let colorBlue = 00;

      colorPicker.addEventListener(('change'), (e) => {
        color = colorPicker.value;
        let hex_code = color.split("");
        let red = parseInt(hex_code[1]+hex_code[2],16);
        colorRed = red;
        let green = parseInt(hex_code[3]+hex_code[4],16);
        colorGreen = green;
        let blue = parseInt(hex_code[5]+hex_code[6],16);
        colorBlue = blue;
        let rgb = red+","+green+","+blue;
        color = rgb;
      })

      public.filters.contrast = function ( contrast ) {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height,
              factor;
      
          contrast || ( contrast = 25 ); // Default value
      
          factor = ( 259 * ( contrast + 255 ) ) / ( 255 * ( 259 - contrast ) );
      
          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];
      
              pixels[ i * 4 ] = factor * ( r - 128 ) + 128;
              pixels[ i * 4 + 1 ] = factor * ( g - 128 ) + 128;
              pixels[ i * 4 + 2 ] = factor * ( b - 128 ) + 128;
          }
      
          context.putImageData( imageData, 0, 0 );
      };

      public.filters.rgbMix = function () {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height;
      
          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];
      
              pixels[ i * 4 ] = 255 - pixels[ i * (4 + 1)]*2;
              pixels[ i * 4 + 1 ] = 255 - pixels[ i * (4 + 2)]*2;
              pixels[ i * 4 + 2 ] = 255 - pixels[ i * (4 + 3)]*2;
          }

          context.putImageData( imageData, 0, 0 );
      };

      public.filters.ctrBrillo = function ( contrast ) {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height,
              factor;
      
          contrast || ( contrast = 30 ); // Default value
      
          factor = ( 259 * ( contrast + 255 ) ) / ( 255 * ( 259 - contrast ) );
      
          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];
      
              pixels[ i * 4 ] = factor * ( r - 128 ) + 128;
              pixels[ i * 4 + 1 ] = factor * ( g - 128 ) + 128;
              pixels[ i * 4 + 2 ] = factor * ( b - 128 ) + 128;
          }
      
          context.putImageData( imageData, 0, 0 );                        
          app.filters.brillo();
      };

      public.filters.cambioColor = function () {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height;
      
          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];
      
              pixels[ i * 4 ] = g;
              pixels[ i * 4 + 1 ] = b;
              pixels[ i * 4 + 2 ] = r;
          }

          context.putImageData( imageData, 0, 0 );
      };

      public.filters.cambioColor2 = function () {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height;
      
          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];
      
              pixels[ i * 4 ] = r - g;
              pixels[ i * 4 + 1 ] = g - b;
              pixels[ i * 4 + 2 ] = b - r;
          }

          context.putImageData( imageData, 0, 0 );
      };

      public.filters.brillo = function () {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height;
      
          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];
      
              pixels[ i * 4 ] = r + 15;
              pixels[ i * 4 + 1 ] = g + 15;
              pixels[ i * 4 + 2 ] = b + 15;
          }

          context.putImageData( imageData, 0, 0 );
      };

      public.filters.onlyBlue = function () {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height;
      
          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];

              var grey = (r + g + b) / 3;
      
              pixels[ i * 4 ] = grey-20;
              pixels[ i * 4 + 1 ] = grey-20;
              pixels[ i * 4 + 2 ] = ((b > r) && (b > g) && Math.abs(r - g) < 50) ? b : grey;
          }

          context.putImageData( imageData, 0, 0 );
      };

      public.filters.onlyRed = function () {
          var imageData = app.getImgData(),
              pixels = imageData.data,
              numPixels = imageData.width * imageData.height;
      
          for ( var i = 0; i < numPixels; i++ ) {
              var r = pixels[ i * 4 ];
              var g = pixels[ i * 4 + 1 ];
              var b = pixels[ i * 4 + 2 ];

              var grey = (r + g + b) / 3;
      
              pixels[ i * 4 ] = ((r > g) && (r > b) && Math.abs(g - b) < 50) ? r : grey;
              pixels[ i * 4 + 1 ] = grey-50;
              pixels[ i * 4 + 2 ] = grey-50;
          }

          context.putImageData( imageData, 0, 0 );
      };

      public.filters.onlyGreen = function () {
        var imageData = app.getImgData(),
            pixels = imageData.data,
            numPixels = imageData.width * imageData.height;
    
        for ( var i = 0; i < numPixels; i++ ) {
            var r = pixels[ i * 4 ];
            var g = pixels[ i * 4 + 1 ];
            var b = pixels[ i * 4 + 2 ];

            var grey = (r + g + b) / 3;
    
            pixels[ i * 4 ] = grey-20;
            pixels[ i * 4 + 1 ] = ((g > r) && (g > b) && Math.abs(r - b) < 50) ? g : grey;
            pixels[ i * 4 + 2 ] = grey-20;
        }

        context.putImageData( imageData, 0, 0 );
      };

      public.filters.onlyYellow = function () {
        var imageData = app.getImgData(),
            pixels = imageData.data,
            numPixels = imageData.width * imageData.height;
    
        for ( var i = 0; i < numPixels; i++ ) {
            var r = pixels[ i * 4 ];
            var g = pixels[ i * 4 + 1 ];
            var b = pixels[ i * 4 + 2 ];

            var grey = (r + g + b) / 3;
    
            pixels[ i * 4 ] = ((r + g)/2 > (grey + 20)) ? r : grey;
            pixels[ i * 4 + 1 ] = ((r + g)/2 > (grey + 20)) ? r : grey;
            pixels[ i * 4 + 2 ] = grey;
        }

        context.putImageData( imageData, 0, 0 );
      };

      public.filters.onlyMagenta = function () {
        var imageData = app.getImgData(),
            pixels = imageData.data,
            numPixels = imageData.width * imageData.height;
    
        for ( var i = 0; i < numPixels; i++ ) {
            var r = pixels[ i * 4 ];
            var g = pixels[ i * 4 + 1 ];
            var b = pixels[ i * 4 + 2 ];

            var grey = (r + g + b) / 3;
            pixels[ i * 4 ] = ((r + b)/2 > (grey + 20)) ? r : grey;
            pixels[ i * 4 + 1 ] = grey;
            pixels[ i * 4 + 2 ] = ((r + b)/2 > (grey + 20)) ? r : grey;
        }

        context.putImageData( imageData, 0, 0 );
      };

      public.filters.darkAlpha = function () {
        var imageData = app.getImgData(),
            pixels = imageData.data,
            numPixels = imageData.width * imageData.height;
    
        for ( var i = 0; i < numPixels; i++ ) {
            var r = pixels[ i * 4 ];
            var g = pixels[ i * 4 + 1 ];
            var b = pixels[ i * 4 + 2 ];
            var a = pixels[ i * 4 + 3 ];
            var j = 50;

            pixels[ i * 4 ] = r;
            pixels[ i * 4 + 1 ] = g;
            pixels[ i * 4 + 2 ] = b;
            pixels[ i * 4 + 3 ] = ((r < j) && (g < j) && (b < j) && (a > j)) ? 0 : a;
        }

        context.putImageData( imageData, 0, 0 );
      };

      public.filters.lightAlpha = function () {
        var imageData = app.getImgData(),
            pixels = imageData.data,
            numPixels = imageData.width * imageData.height;
    
        for ( var i = 0; i < numPixels; i++ ) {
            var r = pixels[ i * 4 ];
            var g = pixels[ i * 4 + 1 ];
            var b = pixels[ i * 4 + 2 ];
            var a = pixels[ i * 4 + 3 ];
            var j = 200;

            pixels[ i * 4 ] = r;
            pixels[ i * 4 + 1 ] = g;
            pixels[ i * 4 + 2 ] = b;
            pixels[ i * 4 + 3 ] = ((r > j) && (g > j) && (b > j) && (a > 0)) ? 0 : a;
        }

        context.putImageData( imageData, 0, 0 );
      };

      public.filters.blackToColor = function () {
        var imageData = app.getImgData(),
            pixels = imageData.data,
            numPixels = imageData.width * imageData.height;
    
        for ( var i = 0; i < numPixels; i++ ) {
            var r = pixels[ i * 4 ];
            var g = pixels[ i * 4 + 1 ];
            var b = pixels[ i * 4 + 2 ];

            pixels[ i * 4 ] = ((r <= g + 10 || r >= g - 10) && (r <= b + 10 || r >= b - 10) && r < 50) ? colorRed : r;
            pixels[ i * 4 + 1 ] = ((g <= r + 10 || g >= r - 10) && (g <= b + 10 || g >= b - 10) && g < 50) ? colorGreen : g;
            pixels[ i * 4 + 2 ] = ((b <= r + 10 || b >= r - 10) && (b <= g + 10 || b >= g - 10) && g < 50) ? colorBlue : b;
        }

        context.putImageData( imageData, 0, 0 );
      };

      public.save = function () {
          var link = window.document.createElement( 'a' ),
              url = canvas.toDataURL(),
              filename = 'screenshot.jpg';
      
          link.setAttribute( 'href', url );
          link.setAttribute( 'download', filename );
          link.style.visibility = 'hidden';
          window.document.body.appendChild( link );
          link.click();
          window.document.body.removeChild( link );
      };

      return public;
} () );