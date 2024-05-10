from flask import render_template, redirect, url_for
from flask_login import login_user, logout_user, current_user
from Teconnect import app, db, login_manager, socketio
from ..models.models import User, RegisterForm, LoginForm 
from werkzeug.security import generate_password_hash, check_password_hash

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@socketio.on('message')
def handle_message(message):
    print('Received message: ' + message)
    socketio.emit('message', message, broadcast=True)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password_hash, form.password.data):
            login_user(user)
            return redirect(url_for('inicio'))
    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data)
        new_user = User(username=form.username.data, email=form.email.data, phone=form.phone.data, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('inicio_sesion'))
    return render_template('register.html', form=form)

@app.route('/dashboard')
def dashboard():
    if current_user.is_authenticated:
        return render_template('inicio.html', username=current_user.username)
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/sobreproyecto')
def sobre_proyecto():
    return render_template('sobreproyecto.html')

@app.route('/quienessomos')
def quienes_somos():
    return render_template('quienessomos.html')

@app.route('/iniciosesion')
def inicio_sesion():
    return render_template('iniciosesion.html')

@app.route('/inicio')
def inicio():
    return render_template('inicio.html')

@app.route('/')
def index():
    return redirect(url_for('inicio_sesion'))