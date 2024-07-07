(function ($) {
  "use strict";

  emailjs.init("tNpA8AcX0wdiHPLNX"); // Replace with your EmailJS user ID

  $.fn.conformyEmailValidate = function () {
    var emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegexp.test(String($(this).val()));
  };

  $.fn.conformyPhoneValidate = function () {
    var phoneRegexp =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return phoneRegexp.test($(this).val());
  };

  $.fn.modalClose = function () {
    let thisModalTarget = $(this).attr("id"),
      $this = $(this);
    $(window).on("click", function (event) {
      if (event.target.id == thisModalTarget) {
        $this.removeClass("active");
      }
    });
  };

  var contactEmail = $("input[name=contact_email]");
  var contactPhone = $("input[name=contact_phone]");
  var formControl = $(".cf-form-control");

  contactEmail.on("keyup", function () {
    if ($(this).val().trim().length > 0) {
      if (!$(this).conformyEmailValidate()) {
        contactEmail.parent().removeClass("success").addClass("error");
      } else {
        contactEmail.parent().removeClass("error").addClass("success");
      }
    } else {
      contactEmail.parent().removeAttr("class");
    }
  });

  contactPhone.on("keyup", function () {
    if ($(this).val().trim().length > 0) {
      if (!$(this).conformyPhoneValidate()) {
        contactPhone.parent().removeClass("success").addClass("error");
      } else {
        contactPhone.parent().removeClass("error").addClass("success");
      }
    } else {
      contactPhone.parent().removeAttr("class").addClass("error");
    }
  });

  $("select[name=contact_subject]").on("change", function () {
    var item = $(this);
    var sNull = $('select[name="contact_subject"]').find("option").eq(0).val();
    if (item.val() == sNull) {
      $('select[name="contact_subject"]')
        .parent()
        .removeClass("success")
        .addClass("error");
    } else {
      $('select[name="contact_subject"]')
        .parent()
        .removeClass("error")
        .addClass("success");
    }
  });

  $(".cf-form-control:not('[name=contact_email],[name=contact_phone]')").on(
    "keyup",
    function () {
      if ($(this).val().trim().length > 0) {
        $(this).parent().removeClass("error").addClass("success");
      } else {
        $(this).parent().removeAttr("class").addClass("error");
      }
    }
  );

  let textCaptcha = $("#txtCaptcha");
  let textCaptchaSpan = $("#txtCaptchaSpan");
  let textInput = $("#txtInput");

  function randomNumber() {
    let a = Math.ceil(Math.random() * 9) + "",
      b = Math.ceil(Math.random() * 9) + "",
      c = Math.ceil(Math.random() * 9) + "",
      d = Math.ceil(Math.random() * 9) + "",
      e = Math.ceil(Math.random() * 9) + "",
      code = a + b + c + d + e;
    textCaptcha.val(code);
    textCaptchaSpan.html(code);
  }

  randomNumber();

  function validateCaptcha() {
    let str1 = textCaptcha.val();
    let str2 = textInput.val();
    return str1 == str2;
  }

  textInput.on("keyup", function () {
    if (validateCaptcha()) {
      $(this).parent().removeClass("error").addClass("success");
    } else {
      $(this).parent().removeAttr("class").addClass("error");
    }
  });

  $("#send_message").on("click", function (event) {
    var $this = $("#contactForm");
    var contact_name = $this.find('input[name="contact_name"]').val().trim();
    var contact_email = $this.find('input[name="contact_email"]').val().trim();
    var contact_phone = $this.find('input[name="contact_phone"]').val().trim();
    var contact_subject = $this
      .find('select[name="contact_subject"]')
      .val()
      .trim();
    var contact_message = $this
      .find('textarea[name="contact_message"]')
      .val()
      .trim();
    var validateEmail = $this
      .find('input[name="contact_email"]')
      .conformyEmailValidate();
    var validatePhone = $this
      .find('input[name="contact_phone"]')
      .conformyPhoneValidate();
    var selectedNull = $this
      .find('select[name="contact_subject"]')
      .find("option")
      .eq(0)
      .val();

    if (
      contact_name === "" ||
      contact_email === "" ||
      contact_phone === "" ||
      contact_message === "" ||
      textInput === "" ||
      contact_subject === selectedNull
    ) {
      $this.find("li").addClass("error");
      if ($("#empty-form").css("display") === "none") {
        $("#empty-form").stop().slideDown().delay(3000).slideUp();
      } else {
        return false;
      }
    } else if (!validateEmail) {
      $('input[name="contact_email"]')
        .parent()
        .removeClass("success")
        .addClass("error");
      if ($("#email-invalid").css("display") === "none") {
        $("#email-invalid").stop().slideDown().delay(3000).slideUp();
      } else {
        return false;
      }
    } else if (contact_subject === selectedNull) {
      $('select[name="contact_subject"]')
        .parent()
        .removeClass("success")
        .addClass("error");
      if ($("#subject-alert").css("display") === "none") {
        $("#subject-alert").stop().slideDown().delay(3000).slideUp();
      } else {
        return false;
      }
    } else if (!validatePhone) {
      $('input[name="contact_phone"]')
        .parent()
        .removeClass("success")
        .addClass("error");
      if ($("#phone-invalid").css("display") === "none") {
        $("#phone-invalid").stop().slideDown().delay(3000).slideUp();
      } else {
        return false;
      }
    } else if (!validateCaptcha()) {
      $("#textInput")
        .parent()
        .find("span")
        .removeClass("success")
        .addClass("error");
      if ($("#security-alert").css("display") === "none") {
        $("#security-alert").stop().slideDown().delay(3000).slideUp();
      } else {
        return false;
      }
    } else {
      $this
        .find(":submit")
        .append('<span class="fas fa-spinner fa-pulse ms-3"></span>');
      $this.find(":submit").attr("disabled", "true");

      // Send email using EmailJS
      emailjs
        .send("service_jyud8vo", "template_i8ky2ve", {
          contact_name: contact_name,
          contact_email: contact_email,
          contact_phone: contact_phone,
          contact_subject: contact_subject,
          contact_message: contact_message,
        })
        .then(
          function (response) {
            $(".cf-form-control").parent().removeAttr("class");
            $("#contactForm")[0].reset();
            if (response.status === 200) {
              $this.find(":submit").removeAttr("disabled");
              $this.find(":submit").find("span").fadeOut();
              $("#success_mail").show();
              $("#success_mail").stop().slideDown().delay(3000).slideUp();
              randomNumber();
            } else {
              $this.find(":submit").removeAttr("disabled");
              $this.find(":submit").find("span").fadeOut();
              $("#error_mail").find("p").html(response.text);
              $("#error_mail").stop().slideDown().delay(3000).slideUp();
              randomNumber();
            }
          },
          function (error) {
            $this.find(":submit").removeAttr("disabled");
            $this.find(":submit").find("span").fadeOut();
            $("#error_mail").find("p").html(error.text);
            $("#error_mail").stop().slideDown().delay(3000).slideUp();
            randomNumber();
          }
        );
    }

    event.preventDefault();
    return false;
  });
})(window.jQuery);
