window.addEventListener('load',function(){
    const canvas=document.getElementById('canvas1');
    const ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const image1=document.getElementById('image1');
    const image2=document.getElementById('image2');
    const image3=document.getElementById('image3');


    class Particle{
        constructor(effect,x,y,color){
            this.effect=effect;
            this.x=Math.random() * this.effect.width;
            this.y=Math.random() * this.effect.height;
            this.originX=Math.floor(x);
            this.originY=Math.floor(y);
            this.color=color;
            this.friction=0.95;
            this.size=this.effect.gap;
            this.velx=0;
            this.vely=0;
            this.ease=0.01;
            this.disX=0;
            this.disY=0;
            this.distance=0;
            this.force=0;
            this.angle=0;
           
        }

        draw(context){
            context.fillStyle=this.color;
            context.fillRect(this.x,this.y,this.size,this.size);
        }
        update(){
            this.disX=this.effect.mouse.x-this.x;
            this.disY=this.effect.mouse.y-this.y;
            this.distance=this.disX*this.disX+this.disY*this.disY;
            this.force=-this.effect.mouse.radius/this.distance;
            if(this.distance>this.effect.mouse.radius)
            {
                this.angle=Math.atan2(this.disY,this.disX);
                this.velx += this.force * Math.cos(this.angle);
                this.vely += this.force * Math.sin(this.angle);
            }
            this.x += (this.velx*=this.friction)+(this.originX-this.x) * this.ease;
            this.y += (this.vely*=this.friction)+(this.originY-this.y) * this.ease;
        }

        warp(){
            this.x=Math.random() * this.effect.width;
            this.y=Math.random() * this.effect.height;
            this.ease=0.01;
        }

    }



    class Effect{
                constructor(width,height){
                        this.width=width;
                        this.height=height;
                        this.particlesarray=[];
                        this.image=document.getElementById('image1');
                        this.imagex=document.getElementById('image2');
                        this.imagex1=document.getElementById('image3');
                        this.centerX=this.width*0.5;
                        this.centerY=this.height*0.5;
                        this.x=this.centerX-this.image.width*0.5;
                        this.y=this.centerY-this.image.height*0.5;
                        this.x1=this.x+490;
                        this.y1=this.y;
                        this.x2=this.x-400;
                        this.y2=this.y+100;
                        this.gap=2;
                        this.mouse={
                            radius : 2000,
                            x : undefined,
                            y : undefined
                        }
                        window.addEventListener('mousemove',event =>{
                            this.mouse.x=event.x;
                            this.mouse.y=event.y;

                        });
                }
                init(context){
                    context.drawImage(this.image,this.x,this.y);
                    context.drawImage(this.imagex,this.x1,this.y1);
                    context.drawImage(this.imagex1,this.x2,this.y2);
                    const pixels=context.getImageData(0,0,this.width,this.height).data;
                    for(let y=0;y<this.height;y=y+this.gap)
                    {
                        for(let x=0;x<this.width;x=x+this.gap)
                        {
                            const index=(y*this.width+x)*4;
                            const red=pixels[index];
                            const green=pixels[index+1];
                            const blue=pixels[index+2];
                            const alpha=pixels[index+3];
                            const color='rgb('+red+','+green+','+blue+')';

                            if(alpha>0)
                            {
                                this.particlesarray.push(new Particle(this,x,y,color));
                            }
                        }
                    }
                }
                draw(context)
                {
                    this.particlesarray.forEach(particle => particle.draw(context));
                }
                update(){
                    this.particlesarray.forEach(particle => particle.update());

                }
                warp()
                {
                    this.particlesarray.forEach(particle => particle.warp());

                }

    }

    const effect= new Effect(canvas.width,canvas.height);
    effect.init(ctx);
    

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        effect.draw(ctx);
        effect.update();
        requestAnimationFrame(animate);
    }
    animate();

    //warp button

    const warpButton=document.getElementById('warpButton');
    warpButton.addEventListener('click',function()
    {
        effect.warp();
    });
})