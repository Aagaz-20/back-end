const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const speakeasy = require('speakeasy');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);



const User = require('../models/user');


exports.postSignUp = async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const name = firstName + ' ' + lastName;
    const password = req.body.password;
    const phone = req.body.phone;
    const email = req.body.email;
    const accommodation = req.body.accommodation;
    const gender = req.body.gender;
    const college = req.body.college;
    const collegeName = req.body.collegeName;

    try{
        const currentUser = await User.findOne({ email: email });
        if(currentUser && currentUser.isEmailVerified){
            return res.status(409).json({ msg: 'User already Registered. Please Login into your account'});
        }else if(currentUser && !currentUser.isEmailVerified){
            return res.status(409).json({ msg: "Please verify your Email and then Login into your account"});
        }else{
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                name: name,
                firstName: firstName,
                lastName: lastName,
                password: hashedPassword,
                phone: phone,
                email: email,
                accommodation: accommodation,
                gender: gender,
                college: college,
                collegeName: collegeName
            })
            

            const token = jwt.sign({
                email: email,
                name: firstName + ' ' + lastName
            },
            'supersecretkeyforaagazwebserver'
            );

            const msg = {
                to: email,
                from: 'officialaagaz20@gmail.com',
                subject: 'Email Verification',
                text: 'Welcome to Aagaz 2020',
                html: `<strong><h2> Welcome to Aagaz 2020. </h2><h3> Here is your Email Verification link. Please click on the link to verify your email address.<br /></h3><h4> <a href="http://aagaz.herokuapp.com/emailverify/${token}">http://aagaz.herokuapp.com/emailverify/${token}</a></h4><br /> <h3> - Team Aagaz</h3><strong>`,
              };
            sgMail.send(msg);
            const result = await user.save();
            console.log(result);

            res.status(201).json({data: result, status: "true", msg : "User Registered"});
        }
    }
    catch(error) {
        console.log(error);
    }

}

exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const currentUser = await User.findOne({ email: email });
        if(!currentUser){
            return res.status(401).json({msg: 'User not exist. Please SignUp first then try again'})
        }else if(currentUser && !currentUser.isEmailVerified){
            return res.status(409).json({ msg: 'Email is not verified yet. Please verify email before login'})
        }else{
            const passwordMatch = await bcrypt.compare(password, currentUser.password);
            if(!passwordMatch){
                return res.status(401).json({ msg: 'Wrong Password'})
            }else{
                const token = jwt.sign({
                    email: currentUser.email,
                    userId: currentUser._id.toString(),
                    name: currentUser.firstName + ' ' + currentUser.lastName
                },
                'supersecretkeyforaagazwebserver'
                );
                res.status(200).json({
                    token: token,
                    firstName: currentUser.firstName,
                    name: currentUser.firstName + ' ' + currentUser.lastName,
                    accommodation: currentUser.accommodation,
                    collegeName: currentUser.collegeName,
                    phone: currentUser.phone,
                    gender: currentUser.gender,
                    payment: currentUser.payment,
                    email: currentUser.email
                });
            }
        }
    }
    catch(error) {
        console.log(error);
    }
}

exports.postEmailVerification = async (req, res) => {
    const token = req.params.token;

    if(!token){
        return res.status(401).json({ msg :'Email not Verified'});
    }
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'supersecretkeyforaagazwebserver');
    
    }catch(err){
        console.log(err);
    }
    if(!decodedToken){
        return res.status(401).json({ msg: 'Email not verified' });
    }
    
    const email = decodedToken.email;
    const currentUser = await User.findOne({ email: email });
    if(!currentUser){
       return res.status(401).json({msg: 'User not exist. Please SignUp first then try again'})
    }else if(currentUser && currentUser.isEmailVerified){
        return res.status(409).json({ msg: 'Email is already verified. Please login into your account'})
    }
    currentUser.isEmailVerified = true;
    const response = currentUser.save();
    return res.status(201).json({ msg: 'Email Verified'});

}

exports.postForgotPassword = async (req, res) => {
    const email = req.body.email;

    try{
        const currentUser = await User.findOne({ email: email });
        if(!currentUser){
            return res.status(401).json({ msg: 'No User Found'});
        }
        const secret = speakeasy.generateSecret({ length: 20}).base32;
        currentUser.clientSecret = secret;
        const result = await currentUser.save();

        const token = speakeasy.totp({
            secret: secret,
            encoding: 'base32',
            window: 10
        });
        const msg = {
            to: email,
            from: 'officialaagaz20@gmail.com',
            subject: 'Password Reset OTP',
            text: 'Welcome to Aagaz 2020',
            html: `<strong><h2> Welcome to Aagaz 2020. </h2><h3> Here is your OTP <b>${token}</b>. Please use this OTP to Reset your Password <br /> - Team Aagaz</h3><strong>`,
          };
        sgMail.send(msg);
        return res.status(201).json({data: result, msg: 'OTP Sent.'});
    }
    catch(err){
        console.log(err);
    }
}

exports.postVerify = async (req, res) => {
    const email = req.body.email;
    const otp = parseInt(req.body.otp);
    const password = req.body.password;

    try{
        const currentUser = await User.findOne({ email: email });
        const verified = await speakeasy.totp.verify({
            secret: currentUser.clientSecret,
            encoding: 'base32',
            token: otp,
            window: 10
        });
        if(!verified){
            return res.status(401).json({ msg: 'Wrong OTP.'});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        currentUser.password = hashedPassword;
        const result = await currentUser.save();
        return res.status(201).json({data: result, msg: 'Password Changed Successfully.'});
    }
    catch(err){
        console.log(err);
    }
}

exports.getLoginData = async ( req, res) => {
    const authHeader =req.get('Authorization')
    if(!authHeader){
        return res.status(401).json({ msg :'Not authenticated'});
    } 
    const token = authHeader.split(' ')[1];
    // console.log(token)
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'supersecretkeyforaagazwebserver');
    
    
        const email = decodedToken.email;
        const response = await User.findOne({ email: email });

        if(!response){
            return res.status(401).json({ msg: 'User not Found'})
        }

        
        
        
        return res.status(201).json({ data: response  })

    }catch(err){
    console.log(err);
}
}