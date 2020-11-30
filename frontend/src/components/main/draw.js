import store from "../../storage/storage";


function getSign(x){
    if (x<0){
        return -1;
    }else{
        return 1;
    }

}


function coordinate_arrow(context, x0, y0, x1, y1) {

    var length_head =7
    var delta_x = x0 - x1;

    context.font='15px courier new';

    context.beginPath()
    context.lineWidth = 2
    context.moveTo(x0, y0)
    context.lineTo(x1, y1)
    context.stroke()


    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1+(getSign(delta_x)*length_head),y1+(getSign(delta_x)*length_head))
    context.lineTo(x1-length_head,y1+length_head)
    context.fill()

}

function getDashLength(x,y){
    let dash_length



    if(x>y){
        dash_length = y / 6
    }else{
        dash_length = x / 6
    }

    return dash_length


}
function getRArray(R_value) {

    let R=[]
    if (R_value != null) {
        R_value=parseFloat(R_value)
        R[0] = R_value
        R[1] = R_value / 2
        R[2] = -R_value / 2
        R[3] = -R_value
    }else R=["R","R/2","-R/2","-R"]

    return R
}

function coordinate_system(context, height_pers, width_pers, R){

    let dash_length






    context.strokeStyle = "black";
    context.fillStyle = "black";


    let y = context.canvas.height * height_pers
    let x = context.canvas.width * width_pers

    let y_coef=(context.canvas.height-y)/2
    let x_coef=(context.canvas.width-x)/2

    dash_length=getDashLength(x,y)

    coordinate_arrow(context, x_coef , context.canvas.height *0.5, context.canvas.width - x_coef, context.canvas.height *0.5)
    context.fillText('X', context.canvas.width - x_coef-10, context.canvas.height * 0.5+15)
    coordinate_arrow(context, context.canvas.width *0.5, context.canvas.height - y_coef, context.canvas.width *0.5, y_coef)
    context.fillText('Y', context.canvas.width * 0.5+10, y_coef+15)

    let counterx=0

    for (let i = -2; i <=2 ; i++) {
        if (i !=0){
            context.fillText(R[counterx],context.canvas.width/2+6,context.canvas.height/2+dash_length*i+5)
            context.beginPath()
            context.moveTo(context.canvas.width/2-4,context.canvas.height/2+dash_length*i)
            context.lineTo(context.canvas.width/2+4,context.canvas.height/2+dash_length*i)
            context.stroke()
            counterx++
        }
    }

    let countery=3
    for (let i = -2; i <=2 ; i++) {
        if(i != 0){
            context.fillText(R[countery],context.canvas.width/2+dash_length*i-5, context.canvas.height/2-10)
            context.beginPath()
            context.moveTo(context.canvas.width/2+dash_length*i, context.canvas.height/2+4)
            context.lineTo(context.canvas.width/2+dash_length*i, context.canvas.height/2-4)
            context.stroke()
            countery--
        }
    }


}
function draw(r,context){


    let r_array=getRArray(r)


    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    let R = getDashLength(context.canvas.width, context.canvas.height)

    context.strokeStyle = "#ffc700"
    context.fillStyle = "#ffc700"

    let step = getDashLength(context.canvas.width, context.canvas.height)
    let x = context.canvas.width/2;
    let y = context.canvas.height/2;

    context.beginPath();
    context.moveTo(x, y);
    context.arc(x, y, step, -Math.PI/2, -Math.PI, true);
    context.fill();

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x+2*step, y);
    context.lineTo(x, y-step);
    context.fill();

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x-2*step, y);
    context.lineTo(x-2*step, y+step);
    context.lineTo(x, y+step);
    context.fill();

    coordinate_system(context,1,1,r_array)
    coordinate_system(context,1,1,r_array)

}


function drawResult(x, y, R,alpha,red,green, context) {



    let dash_length
    if (R == 0){
        dash_length = 0
    } else {
        dash_length = 2*getDashLength(context.canvas.width, context.canvas.height)/R
    }

    context.strokeStyle = `rgba(${red},${green},0,${alpha})`;
    context.fillStyle = `rgba(${red},${green},0,${alpha})`;

    context.beginPath()
    context.moveTo(context.canvas.width/2+x*dash_length,context.canvas.height/2-y*dash_length)
    context.arc(context.canvas.width/2+x*dash_length,context.canvas.height/2-y*dash_length,4,0,2*Math.PI)
    context.fill()
}

function clickPoint(event,context,r, validateNumber, messageText, setResults){



    let R=r
    let dash_length = 4*getDashLength(context.canvas.width, context.canvas.height)/R

    const x_c = event.nativeEvent.offsetX
    const y_c = event.nativeEvent.offsetY

    let x = (2*x_c - context.canvas.width)/dash_length
    let y = -((2*y_c - context.canvas.height)/dash_length)

    console.log((2*x_c - context.canvas.width)/dash_length)

    if (!validateNumber(x, -3, 5) || !validateNumber(y, -5, 5) ||!validateNumber(r, -3, 5)){
        if (messageText.current !== null) {
            messageText.current.show({
                severity: 'warn',
                summary: 'Validation error'
            })
        }
    }else {
        fetch("/api/app/area", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer_${store.getState().token}`
            },
            body: JSON.stringify({x: x, y:y, r: r})
        }).then(response => response.text().then(text => {
            if (response.ok) {
                setResults(JSON.parse(text))
            }
            if (response.status == 403) {
                fetch("/api/refresh/token", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({refresh_token: sessionStorage.getItem("refresh_token")})
                }).then(response => response.json().then(rtoken => {
                    if (response.ok) {
                        store.dispatch({type: "TOKEN_UPDATE", token: rtoken.token})
                        fetch("/api/app/area", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                'Authorization': `Bearer_${store.getState().token}`
                            },
                            body: JSON.stringify({x: x, y: y, r: r})
                        }).then(response => response.text().then(text => {
                            if (response.ok) {
                                setResults(JSON.parse(text))
                            } else {
                                    messageText.current.show({
                                    severity: 'error',
                                    summary: 'Refresh token error'
                                })
                            }
                        }))
                    } else {
                            messageText.current.show({
                            severity: 'error',
                            summary: 'Refresh token error'
                        })
                    }
                }))
            }
        }))
    }


}




function drawPoints(r, results, context){

    if (results.length>0) {
        let i_old;
        let iter = 1;
        if (results.length>5){
            i_old = results.length -5
        }else i_old=0


        for (let i = results.length-1; i >= i_old ; i--) {
            console.log(results[i].x+"                           "+parseFloat(results[i].x))
            if (results[i].res == "true")
                drawResult(parseFloat(results[i].x), parseFloat(results[i].y),parseFloat(r),5 / (5 * iter),0,255, context)
            else drawResult(parseFloat(results[i].x), parseFloat(results[i].y),parseFloat(r),5 / (5 * iter),255 , 0, context)
            iter++
        }

    }
}

export {draw,drawPoints,clickPoint}