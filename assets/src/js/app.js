// Use following syntax to prepend required libraries/scripts
// Use **/*.js if you don't need to follow a specific order
// You can override the order by requiring the JS file before the global require

//=require vendor/**/jquery.min.js
//=require vendor/**/*.js

(function ($) {
  "use strict";

  /* ---------------------------------------------
    sticky nav
  --------------------------------------------- */
  var navOffset = jQuery(".navigation").offset().top;

  jQuery(".navigation").wrap('<div class ="nav-sticky-wrapper"></div>');
  jQuery(".nav-sticky-wrapper").height(jQuery(".navigation").outerHeight());

  jQuery(window).scroll(function () {
    var scrollPos = jQuery(window).scrollTop();

    if (scrollPos >= navOffset) {
      jQuery(".navigation").addClass("navigation-sticky")
    } else {
      jQuery(".navigation").removeClass("navigation-sticky")
    }
  });


  /* ---------------------------------------------
    Login Form
  --------------------------------------------- */
  $(".login__btn, .reg__btn").on("click", function () {
     $(".logreg__form-is-visible").removeClass("logreg__form-is-visible");
    $('body').find('.shopping__cart').removeClass('shopping__cart--visible');
      
    $(this).parent().toggleClass("logreg__form-is-visible");
  });
  
  $(".login__btn, .reg__btn, .login__register-form").on("click", function (e) {
    e.stopPropagation();
  });

  $("body").on("click", function () {
    $(".logreg__form-is-visible").removeClass("logreg__form-is-visible");
  });

   $('.reg__btn').on('click', function(){
      $(".logreg__form-is-visible").removeClass("logreg__form-is-visible");
       $('.register').addClass('logreg__form-is-visible');

   });

    
      $('.login__btn').on('click', function(){
      $(".logreg__form-is-visible").removeClass("logreg__form-is-visible");
       $('.login').addClass('logreg__form-is-visible');
       
       
   });

    
// Post login form
	$('.login__form').on('submit', function(e){

		e.preventDefault();
		var button = $(this).find('button');
			button.button('loading');
		$.post(wc_add_to_cart_params.ajax_url, $('#login_form').serialize(), function(data){

			var obj = $.parseJSON(data);

			$('.log-msg').html(obj.message);
			
			if(obj.error == false){
				window.location.reload(true);
				button.hide();
			}

			button.button('reset');
		});

	});

    
// Post register form
	$('.register__form').on('submit', function(e){

		e.preventDefault();

		var button = $(this).find('button');
			button.button('loading');

		$.post(wc_add_to_cart_params.ajax_url, $('.register__form').serialize(), function(data){
			
			var obj = $.parseJSON(data);

			$('.reg-msg').html(obj.message);
			
			if(obj.error == false){
				//window.location.reload(true);
				button.hide();
			}

			button.button('reset');
			
		});

	});
    
    
  /* ---------------------------------------------
    selectpicker
  --------------------------------------------- */
  $('.select_variation').ssslick({
    onSelected: function (selectedData) {}
  });

  $('.select_variation_plugin').ssslick({
    onSelected: function (selectedData) {}
  });

  /* ---------------------------------------------
    selectpicker ui kit
  --------------------------------------------- */
  $('.selectpicker').ssslick({
    onSelected: function (selectedData) {}
  });

  /* ---------------------------------------------
  header country selection
  --------------------------------------------- */
  $('.country__select').ssslick({
    onSelected: function (selectedData) {}
  });

  /* ---------------------------------------------
    input number
  --------------------------------------------- */
  $('.input__number input[type="number"]').niceNumber({
    buttonDecrement: '<div class="decrement">-</div>',
    buttonIncrement: '<div class="increment">+</div>',
  });

  /* ---------------------------------------------
    venobox
    --------------------------------------------- */
  $('.products-lightbox').venobox();

  /* ---------------------------------------------
    rating
    --------------------------------------------- */
    $('.stars i').on('click', function(){
      $(this).parent().find('i').removeClass('active');
      $(this).addClass('active');
      var rating = $(this).attr('data-value');
      $('.og__rating').val(rating);
  });  

  /* ---------------------------------------------
    search result
    --------------------------------------------- */
  $(".header .form--search input").keyup(function () {
    var search_key = $(this).val();
    var search_link = $(this).attr('data-search') + '?s=';
    $('.form--search__result').addClass('form--search__result--visible');
    $('.search__result-keyword').html(search_key);
    $('.search__result-more a').attr('href', search_link + search_key);


    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: wc_add_to_cart_params.ajax_url,
      data: {
        action: "live_search",
        qq: search_key,
      },
      success: function (response) {
        if (response.found > 0) {
          $('#serech_result_items').html(response.results);
        } else {
          $('#serech_result_items').html("<li class='not_found'>No product found</li>");
        }

      }
    });



  });

  $("body").on("click", function () {
    $(".form--search__result").removeClass("form--search__result--visible");
  });

  $(".form--search__result, .header .form--search input").on("click", function (e) {
    e.stopPropagation();
  });

  /* ---------------------------------------------
    product modal
    --------------------------------------------- */
  $('body').on('click', ".quick-view", function (e) {
    e.stopPropagation();
    $(".logreg__form-is-visible").removeClass("logreg__form-is-visible");
    var product_id = $(this).attr("data-product");
    $(".product-quick-veiw").addClass('loading');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: wc_add_to_cart_params.ajax_url,
      data: {
        action: "quick_view",
        product_id: product_id,
      },
      success: function (response) {
        var product = response;
        $('#qv_product_image').attr('src', product.image);
        $('#qv_title').html(product.title);
        $('#qv_pricing').html(product.pricing);
        $('#qv_cart').attr('data-product', product.id);
        $('#qv_link').attr('href', product.link);
        if (product.variables != '') {
          $('#qv_variation_main').show();
          var ddData = product.variables;
          $('.qv_vars').ssslick({
            data: ddData,
            width: 300,
            imagePosition: "left",
            selectText: "Select a Variation",
            onSelected: function (data) {
              console.log(data);
            }
          });

        } else {
          $('#qv_variation_main').hide();
        }
        $('#qv_pricing').html(product.pricing);
        $(".product-quick-veiw").removeClass('loading');
      }
    });

    $(".product-quick-veiw").addClass("product-quick-veiw__visible");
    $("body").addClass("no-scroll");

  });


  $(".product-quick-veiw .products-details__items-inner").on("click", function (i) {
    i.stopPropagation();
    $('body').find('.ss-pointer').removeClass('ss-pointer-up');
    $('body').find('.ss-pointer').addClass('ss-pointer-down');
    $('body').find('.ss-options').slideUp(100);
  });

  $("body, .product-modal-close").on("click", function () {
    $(".product-quick-veiw").removeClass("product-quick-veiw__visible");
    $("body").removeClass("no-scroll");

  });

  /* ---------------------------------------------
      shopping cart
      --------------------------------------------- */

  $("body").on("click", ".header__cart--btn", function () {
          $(".logreg__form-is-visible").removeClass("logreg__form-is-visible");
    $(".shopping__cart").toggleClass("shopping__cart--visible");
    
  });

  // Ajax delete product in the cart
  $(".header__cart").on("click", ".cart--item-remove", function (e) {
    e.preventDefault();
    var product_id = $(this).attr("data-product_id"),
      cart_item_key = $(this).attr("data-cart_item_key"),
      product_container = $(this).parents('.shopping__cart');
    // Add loader
    /*
        product_container.block({
            message: null,
            overlayCSS: {
                cursor: 'none'
            }
        });
        */
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: wc_add_to_cart_params.ajax_url,
      data: {
        action: "product_remove",
        product_id: product_id,
        cart_item_key: cart_item_key
      },
      success: function (response) {
        if (!response || response.error)
          return;
        var fragments = response.fragments;
        // Replace fragments
        if (fragments) {
          $.each(fragments, function (key, value) {
            $(key).replaceWith(value);
          });
        }
      }
    });
  });

  $("body").on("click", ".shopping__cart, .header__cart--btn", function (e) {
    e.stopPropagation();
  });

  $("body").on("click", function () {
    $(".shopping__cart").removeClass("shopping__cart--visible");
  });



  // Start Add to Cart

  $('body').on('click', '.add-to-cart', function () {

    $(this).addClass('adding-cart');
    var product_id = $(this).attr('data-product');
    var variation_id = $('.select__product__variation').find('.ss-selected-value').val();
    var quantity = $('input[name="quantity"]').val();
    if (typeof quantity == "undefined") {
      quantity = 1;
    }
    //$('.cart-dropdown-inner').empty();

    if (variation_id != '') {
      $.ajax({
        url: wc_add_to_cart_params.ajax_url,
        type: 'POST',
        data: 'action=add_cart_single&product_id=' + product_id + '&variation_id=' + variation_id + '&quantity=' + quantity,

        success: function (results) {
          var response = results;

          if (!response || response.error)
            return;

          var fragments = response.fragments;

          // Replace fragments
          if (fragments) {
            $.each(fragments, function (key, value) {
              $(key).replaceWith(value);
            });
          }
          $('.add-to-cart').removeClass('adding-cart');
          $('html, body').animate({
            scrollTop: 0
          }, 'slow');
          $("body").find('.shopping__cart').addClass('shopping__cart--visible');
          setTimeout(function () {
            $("body").find('.shopping__cart').removeClass('shopping__cart--visible');
          }, 3000);
        }
      });
    } else {
      $.ajax({
        url: wc_add_to_cart_params.ajax_url,
        type: 'POST',
        data: 'action=add_cart_single&product_id=' + product_id + '&quantity=' + quantity,

        success: function (results) {
          var response = results;

          if (!response || response.error)
            return;

          var fragments = response.fragments;

          // Replace fragments
          if (fragments) {
            $.each(fragments, function (key, value) {
              $(key).replaceWith(value);
            });
          }
          $('.add-to-cart').removeClass('adding-cart');
          $('html, body').animate({
            scrollTop: 0
          }, 'slow');
          $("body").find('.shopping__cart').addClass('shopping__cart--visible');
          setTimeout(function () {
            $("body").find('.shopping__cart').removeClass('shopping__cart--visible');
          }, 3000);


        }
      });
    }
  });

    
  $('#qv_cart').on('click', function () {

    $(this).addClass('adding-cart');
    var product_id = $(this).attr('data-product');
    var variation_id = $('.select__product__variation').find('.ss-selected-value').val();
    var quantity = $('input[name="quantity"]').val();
    if (typeof quantity == "undefined") {
      quantity = 1;
    }
    //$('.cart-dropdown-inner').empty();

    if (variation_id != '') {
      $.ajax({
        url: wc_add_to_cart_params.ajax_url,
        type: 'POST',
        data: 'action=add_cart_single&product_id=' + product_id + '&variation_id=' + variation_id + '&quantity=' + quantity,

        success: function (results) {
          var response = results;

          if (!response || response.error)
            return;

          var fragments = response.fragments;

          // Replace fragments
          if (fragments) {
            $.each(fragments, function (key, value) {
              $(key).replaceWith(value);
            });
          }
          $('.add-to-cart').removeClass('adding-cart');
          $('html, body').animate({
            scrollTop: 0
          }, 'slow');
          $("body").find('.shopping__cart').addClass('shopping__cart--visible');
          setTimeout(function () {
            $("body").find('.shopping__cart').removeClass('shopping__cart--visible');
          }, 3000);
            
         $(".product-quick-veiw").removeClass("product-quick-veiw__visible");
    $("body").removeClass("no-scroll");
        }
      });
    } else {
      $.ajax({
        url: wc_add_to_cart_params.ajax_url,
        type: 'POST',
        data: 'action=add_cart_single&product_id=' + product_id + '&quantity=' + quantity,

        success: function (results) {
          var response = results;

          if (!response || response.error)
            return;

          var fragments = response.fragments;

          // Replace fragments
          if (fragments) {
            $.each(fragments, function (key, value) {
              $(key).replaceWith(value);
            });
          }
          $('.add-to-cart').removeClass('adding-cart');
          $('html, body').animate({
            scrollTop: 0
          }, 'slow');
          $("body").find('.shopping__cart').addClass('shopping__cart--visible');
          setTimeout(function () {
            $("body").find('.shopping__cart').removeClass('shopping__cart--visible');
          }, 3000);
            
         $(".product-quick-veiw").removeClass("product-quick-veiw__visible");
    $("body").removeClass("no-scroll");


        }
      });
    }
  });
    
    
    
  $('.form--search__result').on('click', '.add-to-cart-from-search', function () {

    $(this).addClass('adding-cart');
    var product_id = $(this).attr('data-product');
    var variation_id = $('.select__product__variation').find('.ss-selected-value').val();
    var quantity = $('input[name="quantity"]').val();
    if (typeof quantity == "undefined") {
      quantity = 1;
    }
    //$('.cart-dropdown-inner').empty();

    if (variation_id != '') {
      $.ajax({
        url: wc_add_to_cart_params.ajax_url,
        type: 'POST',
        data: 'action=add_cart_single&product_id=' + product_id + '&variation_id=' + variation_id + '&quantity=' + quantity,

        success: function (results) {
          var response = results;

          if (!response || response.error)
            return;

          var fragments = response.fragments;

          // Replace fragments
          if (fragments) {
            $.each(fragments, function (key, value) {
              $(key).replaceWith(value);
            });
          }
          $('.add-to-cart').removeClass('adding-cart');
          $('html, body').animate({
            scrollTop: 0
          }, 'slow');
          $("body").find('.shopping__cart').addClass('shopping__cart--visible');
          setTimeout(function () {
            $("body").find('.shopping__cart').removeClass('shopping__cart--visible');
          }, 3000);
        }
      });
    } else {
      $.ajax({
        url: wc_add_to_cart_params.ajax_url,
        type: 'POST',
        data: 'action=add_cart_single&product_id=' + product_id + '&quantity=' + quantity,

        success: function (results) {
          var response = results;

          if (!response || response.error)
            return;

          var fragments = response.fragments;

          // Replace fragments
          if (fragments) {
            $.each(fragments, function (key, value) {
              $(key).replaceWith(value);
            });
          }
          $('.add-to-cart').removeClass('adding-cart');
          $('html, body').animate({
            scrollTop: 0
          }, 'slow');
          $("body").find('.shopping__cart').addClass('shopping__cart--visible');
          setTimeout(function () {
            $("body").find('.shopping__cart').removeClass('shopping__cart--visible');
          }, 3000);


        }
      });
    }
  });

  // End add to cart 


  // Load More 


  $('.load-more-items').on('click', function () {
    var page = $(this).attr('data-page');
    var cat = $(this).attr('data-cat');
    $('.item-message').html('<i class="ss-loading"></i>');
    $('.item-message').fadeIn();
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: wc_add_to_cart_params.ajax_url,
      data: {
        action: "load_more",
        page: page,
        cat: cat
      },
      success: function (response) {
        if (response.found > 0) {
          $('.product__item').append(response.products);

          $('.load-more-items').attr('data-page', response.page);
          $('.item-message').fadeOut();
        } else {
          $('.item-message').fadeIn();
          $('.item-message').html("No Items to load");
          setTimeout(function () {
            $('.item-message').fadeOut();
          }, 1000);

        }
      }
    });



  });

// Update Cart Qunatity 
    
$('body').on('change','.cart_qty', function(){
    var key = $(this).attr('data-key');
    var product = $(this).attr('data-product');
    var qty = $(this).val();
      $.ajax({
      type: 'POST',
      dataType: 'json',
      url: wc_add_to_cart_params.ajax_url,
      data: {
        action: "product_quantity",
        cart_item_key: key,
        product_id: product,
        qty: qty
      },
      success: function (response) {
          if (!response || response.error)
          return;
        var fragments = response.fragments;
        // Replace fragments
        if (fragments) {
          $.each(fragments, function (key, value) {
            $(key).replaceWith(value);
          });
        }
      }
    });  
    
});
  // Filter By Cat

  $('.catfilter').on('click', function () {
    var cat = $(this).attr('data-filter');

    $('.item-message').html('<i class="ss-loading"></i>');
    $('.item-message').fadeIn();
    $('.products-home .product__item').html("");
    $('.catfilter').removeClass('active');
    $(this).addClass('active');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: wc_add_to_cart_params.ajax_url,
      data: {
        action: "filter_cat",
        cat: cat
      },
      success: function (response) {
        if (response.found > 0) {
          $('.products-home .product__item').html(response.products);

          $('.load-more-items').attr('data-page', 1);
          $('.item-message').fadeOut();
        } else {
          $('.item-message').fadeIn();
          $('.item-message').html("No Items found");
          setTimeout(function () {
            $('.item-message').fadeOut();
          }, 1000);

        }
        $('.load-more-items').attr('data-cat', response.cat);
      }
    });


  });

  //Cat filter Archive

  $('.catfilter_archive').on('click', function () {
    var cat = $(this).attr('data-filter');

    $('.item-message').html('<i class="ss-loading"></i>');
    $('.item-message').fadeIn();
    $('.products_archive').html("");
    $('.catfilter_archive').removeClass('active');
    $(this).addClass('active');
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: wc_add_to_cart_params.ajax_url,
      data: {
        action: "filter_cat",
        cat: cat
      },
      success: function (response) {
        if (response.found > 0) {
          $('.products_archive').html(response.products);

          $('.item-message').fadeOut();
        } else {
          $('.item-message').fadeIn();
          $('.item-message').html("No Items found");
          setTimeout(function () {
            $('.item-message').fadeOut();
          }, 1000);

        }
      }
    });


  });

  //Price Range filter

  function RangeFilter() {
    var min = $('.min_range').val();
    var max = $('.max_range').val();
    var cat = $('.catfilter_archive active').attr('data-filter');

    $('.item-message').html('<i class="ss-loading"></i>');
    $('.item-message').fadeIn();
    $('.products_archive').html("");

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: wc_add_to_cart_params.ajax_url,
      data: {
        action: "get_by_price",
        cat: cat,
        min: min,
        max: max,
      },
      success: function (response) {
        if (response.found > 0) {
          $('.products_archive').html(response.results);

          $('.item-message').fadeOut();
        } else {
          $('.item-message').fadeIn();
          $('.item-message').html("No Items found");
          setTimeout(function () {
            $('.item-message').fadeOut();
          }, 1000);

        }
      }
    });


  }

  $('.min_range').on('change', function () {
    RangeFilter();


  });

  $('.max_range').on('change', function () {
    RangeFilter();


  });
  /* ---------------------------------------------
    Slider
    --------------------------------------------- */
  $(".hero__modern--slider").slick({
    autoplay: false,
    autoplaySpeed: 9000,
    speed: 700,
    mobileFirst: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    cssEase: 'linear',
    fade: true,
    arrows: false,
    draggable: false,
    dots: true,
    prevArrow: '<div><button class="prevArrow"><img src="assets/dist/layout/arrow-prev.png"></button></div>',
    nextArrow: '<div><button class="nextArrow"><img src="assets/dist/layout/arrow-next.png"></button></div>',
  });

  /* ---------------------------------------------
    Brands carousel
    --------------------------------------------- */
  $(".brands__items").slick({
    slidesToShow: 8,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 9000,

    responsive: [{
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  });


  /* ---------------------------------------------
 products Details Slider
  --------------------------------------------- */
  $('.products__details-slider .products__details-items').slick({
    slidesToShow: 1,
    slidesToScroll: 2,
    fade: true,
    asNavFor: '.slider-nav',
    draggable: false,
    arrows: false,
  });

  $('.products__details-slider .slider-nav').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: false,
    focusOnSelect: true,
    centerMode: true,
    centerPadding: '0px',
    prevArrow: "<button class='slick-prev pull-left'><i class='fa fa-angle-left'></i></button>",
    nextArrow: "<button class='slick-next pull-right'><i class='fa fa-angle-right'></i></button>",
    responsive: [{
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },

    ]
  });

  /* ---------------------------------------------
  Tab
  --------------------------------------------- */
  /* Tab-1 */
  $('.nav-tabs li a').click(function () {
    $('.nav-tabs li a').removeClass('active');
    $(this).addClass('active');
    return false;
  });

  $('.tab__pane article').hide();
  $('.tab__pane article.active').show();

  $('.nav-tabs li a').click(function () {
    $('.tab__pane article').hide();

    var activeTabe = $(this).attr('href');
    $(activeTabe).show();
    return false;
  });

  /* Tab-2 */
  $('.nav-tabs-2 li a').click(function () {
    $('.nav-tabs-2 li a').removeClass('active');
    $(this).addClass('active');
    return false;
  });

  $('.tab__pane-2 .nutrition-facts').hide();
  $('.tab__pane-2 .nutrition-facts.active').show();

  $('.nav-tabs-2 li a').click(function () {
    $('.tab__pane-2 .nutrition-facts').hide();

    var activeTabe = $(this).attr('href');
    $(activeTabe).show();
    return false;
  });

    
 /* ---------------------------------------------
  Country Selectbox
  --------------------------------------------- */   
  if($("#shipping_country").length > 0){
       $('#shipping_country').ssslick({
   onSelected: function (selectedData) {}
 }); 
  
  }
    


  if($("#billing_country").length > 0){
       $('#billing_country').ssslick({
   onSelected: function (selectedData) {}
 }); 
  
  }

  /* ---------------------------------------------
  Range filter
  --------------------------------------------- */

  var DEBUG = false, // make true to enable debug output
    PLUGIN_IDENTIFIER = "RangeSlider";

  var RangeSlider = function (element, options) {
    this.element = element;
    this.options = options || {};
    this.defaults = {
      output: {
        prefix: '', // function or string
        suffix: '', // function or string
        format: function (output) {
          return output;
        }
      },
      change: function (event, obj) {}
    };
    // This next line takes advantage of HTML5 data attributes
    // basis.
    this.metadata = $(this.element).data('options');
  };

  RangeSlider.prototype = {

    ////////////////////////////////////////////////////
    // Initializers
    ////////////////////////////////////////////////////

    init: function () {
      if (DEBUG && console) console.log('RangeSlider init');
      this.config = $.extend(true, {}, this.defaults, this.options, this.metadata);

      var self = this;
      // Add the markup for the slider track
      this.trackFull = $('<div class="track track--full"></div>').appendTo(self.element);
      this.trackIncluded = $('<div class="track track--included"></div>').appendTo(self.element);
      this.inputs = [];

      $('input[type="range"]', this.element).each(function (index, value) {
        var rangeInput = this;
        // Add the ouput markup to the page.
        rangeInput.output = $('<output>').appendTo(self.element);
        // Get the current z-index of the output for later use
        rangeInput.output.zindex = parseInt($(rangeInput.output).css('z-index')) || 1;
        // Add the thumb markup to the page.
        rangeInput.thumb = $('<div class="slider-thumb">').prependTo(self.element);
        // Store the initial val, incase we need to reset.
        rangeInput.initialValue = $(this).val();
        // Method to update the slider output text/position
        rangeInput.update = function () {
          if (DEBUG && console) console.log('RangeSlider rangeInput.update');
          var range = $(this).attr('max') - $(this).attr('min'),
            offset = $(this).val() - $(this).attr('min'),
            pos = offset / range * 100 + '%',
            transPos = offset / range * -100 + '%',
            prefix = typeof self.config.output.prefix == 'function' ? self.config.output.prefix.call(self, rangeInput) : self.config.output.prefix,
            format = self.config.output.format($(rangeInput).val()),
            suffix = typeof self.config.output.suffix == 'function' ? self.config.output.suffix.call(self, rangeInput) : self.config.output.suffix;

          // Update the HTML
          $(rangeInput.output).html(prefix + '' + format + '' + suffix);
          $(rangeInput.output).css('left', pos);
          $(rangeInput.output).css('transform', 'translate(' + transPos + ',0)');

          // Update the IE hack thumbs
          $(rangeInput.thumb).css('left', pos);
          $(rangeInput.thumb).css('transform', 'translate(' + transPos + ',0)');

          // Adjust the track for the inputs
          self.adjustTrack();
        };

        // Send the current ouput to the front for better stacking
        rangeInput.sendOutputToFront = function () {
          $(this.output).css('z-index', rangeInput.output.zindex + 1);
        };

        // Send the current ouput to the back behind the other
        rangeInput.sendOutputToBack = function () {
          $(this.output).css('z-index', rangeInput.output.zindex);
        };

        ///////////////////////////////////////////////////
        // IE hack because pointer-events:none doesn't pass the 
        // event to the slider thumb, so we have to make our own.
        ///////////////////////////////////////////////////
        $(rangeInput.thumb).on('mousedown', function (event) {
          // Send all output to the back
          self.sendAllOutputToBack();
          // Send this output to the front
          rangeInput.sendOutputToFront();
          // Turn mouse tracking on
          $(this).data('tracking', true);
          $(document).one('mouseup', function () {
            // Turn mouse tracking off
            $(rangeInput.thumb).data('tracking', false);
            // Trigger the change event
            self.change(event);
          });
        });

        // IE hack - track the mouse move within the input range
        $('body').on('mousemove', function (event) {
          // If we're tracking the mouse move
          if ($(rangeInput.thumb).data('tracking')) {
            var rangeOffset = $(rangeInput).offset(),
              relX = event.pageX - rangeOffset.left,
              rangeWidth = $(rangeInput).width();
            // If the mouse move is within the input area
            // update the slider with the correct value
            if (relX <= rangeWidth) {
              var val = relX / rangeWidth;
              $(rangeInput).val(val * $(rangeInput).attr('max'));
              rangeInput.update();
            }
          }
        });

        // Update the output text on slider change
        $(this).on('mousedown input change touchstart', function (event) {
          if (DEBUG && console) console.log('RangeSlider rangeInput, mousedown input touchstart');
          // Send all output to the back
          self.sendAllOutputToBack();
          // Send this output to the front
          rangeInput.sendOutputToFront();
          // Update the output
          rangeInput.update();
        });

        // Fire the onchange event 
        $(this).on('mouseup touchend', function (event) {
          if (DEBUG && console) console.log('RangeSlider rangeInput, change');
          self.change(event);
        });

        // Add this input to the inputs array for use later
        self.inputs.push(this);
      });

      // Reset to set to initial values
      this.reset();

      // Return the instance
      return this;
    },

    sendAllOutputToBack: function () {
      $.map(this.inputs, function (input, index) {
        input.sendOutputToBack();
      });
    },

    change: function (event) {
      if (DEBUG && console) console.log('RangeSlider change', event);
      // Get the values of each input
      var values = $.map(this.inputs, function (input, index) {
        return {
          value: parseInt($(input).val()),
          min: parseInt($(input).attr('min')),
          max: parseInt($(input).attr('max'))
        };
      });

      // Sort the array by value, if we have 2 or more sliders
      values.sort(function (a, b) {
        return a.value - b.value;
      });

      // call the on change function in the context of the rangeslider and pass the values
      this.config.change.call(this, event, values);
    },

    reset: function () {
      if (DEBUG && console) console.log('RangeSlider reset');
      $.map(this.inputs, function (input, index) {
        $(input).val(input.initialValue);
        input.update();
      });
    },

    adjustTrack: function () {
      if (DEBUG && console) console.log('RangeSlider adjustTrack');
      var valueMin = Infinity,
        rangeMin = Infinity,
        valueMax = 0,
        rangeMax = 0;

      // Loop through all input to get min and max
      $.map(this.inputs, function (input, index) {
        var val = parseInt($(input).val()),
          min = parseInt($(input).attr('min')),
          max = parseInt($(input).attr('max'));

        // Get the min and max values of the inputs
        valueMin = (val < valueMin) ? val : valueMin;
        valueMax = (val > valueMax) ? val : valueMax;
        // Get the min and max possible values
        rangeMin = (min < rangeMin) ? min : rangeMin;
        rangeMax = (max > rangeMax) ? max : rangeMax;
      });

      // Get the difference if there are 2 range input, use max for one input.
      // Sets left to 0 for one input and adjust for 2 inputs
      if (this.inputs.length > 1) {
        this.trackIncluded.css('width', (valueMax - valueMin) / (rangeMax - rangeMin) * 100 + '%');
        this.trackIncluded.css('left', (valueMin - rangeMin) / (rangeMax - rangeMin) * 100 + '%');
      } else {
        this.trackIncluded.css('width', valueMax / (rangeMax - rangeMin) * 100 + '%');
        this.trackIncluded.css('left', '0%');
      }
    }
  };

  RangeSlider.defaults = RangeSlider.prototype.defaults;

  $.fn.RangeSlider = function (options) {
    if (DEBUG && console) console.log('$.fn.RangeSlider', options);
    return this.each(function () {
      var instance = $(this).data(PLUGIN_IDENTIFIER);
      if (!instance) {
        instance = new RangeSlider(this, options).init();
        $(this).data(PLUGIN_IDENTIFIER, instance);
      }
    });
  };


  var rangeSlider = $('#facet-price-range-slider');
  if (rangeSlider.length > 0) {
    rangeSlider.RangeSlider({
      output: {
        format: function (output) {
          return output.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        },
        suffix: function (input) {
          return parseInt($(input).val()) == parseInt($(input).attr('max')) ? this.config.maxSymbol : '';
        }
      }
    });
  }

})(jQuery);
