async function init(){
    
    const model = await tf.loadModel("./model/model.json",false);
    console.log('model loaded from storage');
	
	play(model)
	

}    

function preprocess(img)
{
	console.log('Preprocessing image')
    //convert the image data to a tensor 
    let tensor = tf.fromPixels(img)
	
    //resize to 50 X 50
    const resized = tf.image.resizeBilinear(tensor, [224, 224]).toFloat()

    // Normalize the image 
    const offsetR = tf.scalar(103.939);
    const offsetG = tf.scalar(116.779);
    const offsetB = tf.scalar(123.68);


    for (i=0;i<224;i++){
        for (j=0;j<224;j++){
            resized[i,j,0]=resized[i,j,0]-offsetR
            resized[i,j,1]=resized[i,j,1]-offsetG
            resized[i,j,2]=resized[i,j,2]-offsetB
        }
    }

        // Normalize the image 
    const offset = tf.scalar(255.0);
    //const normalized = tf.scalar(1.0).sub(resized.div(offset));
    const normalized = resized.div(offset)
    //We add a dimension to get a batch shape 
    const batched = (normalized.transpose([2, 1, 0])).expandDims(0)
    console.log('Image is ready')
    return batched

}

function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#blah')
                        .attr('src', e.target.result)
                        .width(224)
                        .height(224);
                };

                reader.readAsDataURL(input.files[0]);
				init()
            }
			
        }

function play(model){
	photo = document.getElementById('blah'),
	console.log(photo)
	var image = new Image();
		image.id = "pic"
		image.src =photo.src;
	
	predit(model, image)

}

function predit(model,image){

	// predict move
	
    prediction = model.predict([preprocess(image)]).dataSync()
    console.log('Made my prediction')
	
	pr = tf.tensor(prediction)
	
	pr = pr.reshape([ 224 ,  224 , 8 ])
	
	var pasd = tf.argMax(pr,axis=2).dataSync();
	console.log(pasd)

    colors = new Array(8)
    const classpred = tf.tensor(pasd)
    var Uniques = new Array(8)
    for (c = 0; c < 8; c++){
        Uniques[c]=0;
    }
    const claspred1 = classpred.reshape([224, 224])
    for (i=0;i<224;i++){
        for (j=0;j<224;j++){
            Uniques[claspred1.get(i,j)]=Uniques[claspred1.get(i,j)]+1;
        }
    }
    console.log(Uniques)
  
  
    for (i = 0; i < 8; i++) {
        colors[i] = [Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)];     
    }

    R = new Array(224)
    G = new Array(224)
    B = new Array(224)

    var cur=0;

    for (c = 0; c < 8; c++){
        for (i= 0; i < 224; i++) {

            R[i] = new Array(224)
            G[i] = new Array(224)
            B[i] = new Array(224)
            for (j = 0; j < 224; j++) {
                            
                if (claspred1.get(i,j)==c){
                  
                
                    R[i][j]=colors[c][0]
                    G[i][j]=colors[c][1]
                    B[i][j]=colors[c][2]

            
                }
                cur=cur+1;
            
            }
        }
        cur=0;
    }


// create an offscreen canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// get the imageData and pixel array from the canvas
var imgData = ctx.getImageData(0, 0, 224, 224);
var data = imgData.data;
   /* var cur=0;
    const shape = [224, 224,3];
  
    const seg_img = tf.zeros(shape, tf.int32) 

    const buffer = tf.buffer([224,224,3], seg_img.dtype, seg_img.dataSync());

	for (c = 0; c < 8; c++){

        for (i = 0; i < 224; i++) {
            for (j = 0; j < 224; j++) {
                if (classpred.get(cur)==c){
                    buffer.set(colors[c][0],i,j,0)
                    buffer.set(colors[c][1],i,j,1)
                    buffer.set(colors[c][2],i,j,2)


                    
                    
                }
                cur=cur+1;
            }
        }
        cur=0;
    }
const b = buffer.toTensor();
console.log(b)

// create an offscreen canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// size the canvas to your desired image
canvas.width = 224;
canvas.height = 224;


var i;


R = new Array(224)
G = new Array(224)
B = new Array(224)


for (i = 0; i < 224; i++) {
        R[i] = new Array(224)
        G[i] = new Array(224)
        B[i] = new Array(224)
            for (j = 0; j < 224; j++) {
                
                    R[i][j]=b.get(i,j,0)
                    G[i][j]=b.get(i,j,1)
                    B[i][j]=b.get(i,j,2)

            }
        }

*/
var jo=0;
var ko=0;
var counts=1;



for (i = 0; i < imgData.data.length; i += 4) {
  imgData.data[i] = R[ko][jo]
  imgData.data[i + 1] =G[ko][jo]
  imgData.data[i + 2] = B[ko][jo]
  imgData.data[i + 3] = 255;
  
  if (counts<224){
    ko=ko+1;
    counts = counts+1;
  }else{
    jo=jo+1;
    ko=0;
    counts=1;
  }

}



// put the modified pixels back on the canvas
ctx.putImageData(imgData, 0, 0);



}

