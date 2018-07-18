var Paste = require('../models/paste');
var shortid = require('shortid');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var datenow = new Date().toString();

// GET request
exports.paste_create_get = function(req, res, next) {
    res.render('input_form_editor', {
        language: 'javascript',
        shortid: shortid.generate()
    });
    //NOTE: sendFile is independent of middleware static
    //res.sendFile('index.html', { root: path.join(__dirname, '../public') })

};



// Handle Paste create on POST.
exports.paste_create_post = [

    //console.log(req.body.paste);
    //console.log(req.body.idx);

    // Validate that the paste field is not empty.
    body('paste').trim().isLength({ min: 1 }).withMessage('Enter something to post'),
    body('idx').trim().isLength({ min: 1 }).withMessage('ID should not be empty.'),
    body('title').trim().isLength({ min: 1 }).withMessage('Enter a title to post'),
    
    //body('title', )

    // Sanitize the paste and id field.
    //sanitizeBody('paste').trim(),
    //sanitizeBody('idx').trim(),
    sanitizeBody('ttl').trim().toInt(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        var minutes = req.body.ttl;
        var exp_date = new Date(Date.now() + (minutes * 60 * 1000));
        console.log(exp_date);

        // Create a genre object with escaped and trimmed data.
        var pastesubmit = new Paste(
          { 
            idx: req.body.idx,
            paste: req.body.paste,
            expirationDate: exp_date,
            title: req.body.title
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            console.log(errors.array())
            res.render('input_form_editor', { errors: errors.array(),
                                              shortid: shortid.generate()
                                            });
            //res.sendFile('index.html', { root: path.join(__dirname, '../public') })
            console.log('Errors while submitting, plx to recheck!!!')
        return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Paste.findOne({ 'idx': req.body.idx })
                .exec( function(err, found_paste) {
                     if (err) { return next(err); }

                     if (found_paste) {
                         // Genre exists, redirect to its detail page.
                         //res.redirect(found_genre.url);
                         //console.log('Previous paste found with same url')
                         // Quick Hack used to be compatible with errors
                         error = [{msg : ' '}]
                         error[0].msg = 'ID already in use, please try another ID';
                         res.render('input_form_editor', { 
                            errors: error,
                            shortid: shortid.generate()
                          });
                     }
                     else {

                         pastesubmit.save(function (err) {
                           if (err) { return next(err); }
                           // Genre saved. Redirect to genre detail page.
                           console.log('Succesful post')
                           res.redirect('/pastes/' + req.body.idx);
                         });

                     }

                 });
        }
    }
];

