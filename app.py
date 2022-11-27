import io
from flask import Flask, render_template, request, send_file
from vits.tts import *  
from scipy.io.wavfile import write
import torch
import os 


app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/Register')
def register():
    return render_template('Register.html')

@app.route('/About')
def about():
    return render_template('About.html')

@app.route('/Audio')
def produceaudio():
    return render_template('TTS.html')

@app.route('/Avatar')
def createavatar():
    return render_template('avatar.html')

@app.route('/home')
def homepage():
    return render_template('home2.html')




@app.route('/call/vits', methods=["GET"])
def call_vits():
    text  = request.args.get('text')
    stn_tst = get_text(text, hps)
    with torch.no_grad():
        x_tst = stn_tst.cuda().unsqueeze(0)
        x_tst_lengths = torch.LongTensor([stn_tst.size(0)]).cuda()
        sid = torch.LongTensor([30]).cuda()
        audio = net_g.infer(x_tst, x_tst_lengths, sid=sid, noise_scale=.667, noise_scale_w=0.8, length_scale=1,audiopath='test.wav')[0][0,0].data.cpu().float().numpy()
    out = io.BytesIO()
    write(out, hps.data.sampling_rate, audio)
    return send_file(out, mimetype='audio/wav')

if __name__ == '__main__':
    app.run(debug=True, host='::', port=5000)