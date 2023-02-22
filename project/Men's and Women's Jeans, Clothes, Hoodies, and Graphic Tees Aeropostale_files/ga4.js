$(function() {

	function convertDataLaterProductToG4ArrayConvert(arr){
		var result = [];
		for(var i = 0; arr.length > i; i++){
			result.push(convertDataLaterProductToG4(arr[i]));
		}
		return result;		
	}
	
	function convertDataLaterProductToG4(elem, categoryid){
		var obj = {
                item_id: elem.id,
                item_name: elem.name,
                coupon: '',
                currency: 'USD',
                discount: '',
                index: elem.position || "1",
                item_brand: elem.brand,
                item_category: elem.category ? elem.category.toLowerCase() : '',
                item_list_id: categoryid || "",
                item_list_name: elem.list,
                item_variant: elem.variant,
                price: elem.price,
                quantity: '1',
                item_class: elem['dimension11'],
                item_division_number: elem['dimension12'],
                item_department_number: elem['dimension13'],
                item_color: elem['dimension17'],
                item_size: elem['dimension25'],
                item_price_type: elem['dimension26'],
                item_gender: '',
                item_style_number: elem['dimension29'],
                item_badging: elem['dimension31'],
                'item_sub-department': '',
                item_color_family: elem['dimension33'],
                item_rating: '0',
                item_review_count: '0',
                item_in_stock: elem['dimension36'],
                item_eStockroom_store_id: window.eStockRoomStoreID,
                item_eStockroom_employee_id: window.eStockRoomEmployeeID
        };
		
		return obj;
	}
	
    if (window.pageContext.ns == 'search') {

        function initCategoryPage() {
            if ($(".product-tile").length) {
				try {
					dataLayer.push({
						ecommerce: null
					});

					var impressions = [];
					var breadcrumbds = [];
					$(".breadcrumb-element span").each(function(){
						breadcrumbds.push($(this).text());
					});
					breadcrumbds = breadcrumbds.join(" / ").toLowerCase();
					$(".product-tile[data-ga4]").each(function() {
						if (!$(this).hasClass('send')) {
							var ga4 = $(this).data("ga4");
							if (ga4 == null || Object.keys(ga4).length === 0) {
								console.log("ga4.js: plp tile error on pos:"+($(this).parent().data('count')));
								return;
							}
							$(this).addClass('send');

							if (ga4) {
								ga4.dimension37 = window.eStockRoomStoreID;
								ga4.dimension38 = window.eStockRoomEmployeeID;
							}
							if(window.location.href.indexOf('q=') > -1){
								ga4.list = $(".js-search-phrase").data("searchphrase");
							}
							
							ga4.position = $(".product-tile[data-ga4]").index($(this)) + 1;
							impressions.push(ga4);
						}
					});
					if (impressions.length) {
						dataLayer.push({
							event: 'productImpression',
							'ecommerce': {
								'impressions': impressions
							}
						});


						window.dataLayer = window.dataLayer || [];

						var view_item_listElements = [];
						var categoryid = $(".product-tile:eq(0)").data("categoryid");
						if (!categoryid || categoryid == null || categoryid == "") {
							if($(".product-tile:eq(0)").data("searchquery").length){
								categoryid = "search results";
							}
						}
						if(window.location.href.indexOf('q=') > -1){                    	
							categoryid = $(".js-search-phrase").data("searchphrase");
						}
						
						$(impressions).each(function(i, elem) {
							var obj = convertDataLaterProductToG4(elem, categoryid);
							view_item_listElements.push(obj);
						});

						window.dataLayer.push({
							event: 'view_item_list',
							ecommerce: {
								item_list_id: categoryid,
								item_list_name: view_item_listElements[0].item_list_name,
								items: view_item_listElements
							}
						});
					}
				} catch (error) {
					console.log("ga4.js: PLP error:"+(error.message));
				}
            }
        }

        initCategoryPage();
        $(document).on("ga4plp", initCategoryPage);
    }
    
    
    function processClickToProduct(ga4Div){
    	if (ga4Div) {
       	 console.log(ga4Div);
       	 var ga4 = ga4Div.data("ga4");
       	 ga4.dimension37 = window.eStockRoomStoreID;
            ga4.dimension38 = window.eStockRoomEmployeeID;
            if(window.pageContext.ns == 'search'){
           	 ga4.position = $(".product-tile[data-ga4]").index(ga4Div) + 1;
            } else {
           	 ga4.position = 0;
            }
            
            var breadcrumbds = [];
            $(".breadcrumb-element span").each(function(){
            	breadcrumbds.push($(this).text());
            });
            if(breadcrumbds.length){
           	 breadcrumbds = breadcrumbds.join(" / ").toLowerCase();
           	 ga4.list = breadcrumbds;
            }
            
            var categoryid = $(".product-tile:eq(0)").data("categoryid");
            if (!categoryid || categoryid == null || categoryid == "") {
           	 if($(".product-tile:eq(0)").data("searchquery").length){
           		 categoryid = "search_query-" + $(".product-tile:eq(0)").data("searchquery");
           	 }                 
            }
            
           dataLayer.push({
               ecommerce: null
           }); // Clear the previous ecommerce object.
           dataLayer.push({
               'event': 'productClick',
               'ecommerce': {
                   'click': {
                       'actionField': {
                           'list': categoryid
                       },
                       'products': [ga4]
                   }
               }
           });
           
           var objeGA4 = convertDataLaterProductToG4(ga4, categoryid);
           
           window.dataLayer = window.dataLayer || [];
           window.dataLayer.push({
               event: 'select_item',
               item_list_id: categoryid,
               item_list_name: objeGA4.item_list_name,
               ecommerce: {
                   items: [objeGA4]
               }
           });

       }
    }

    $(document).on("processClickToProduct", processClickToProduct);
    
    $(document).on('click touchend', '[data-ga4] a, .quickview[data-product-component="quickview"]', function(e) {
        var ga4Div = $(this).parents("div[data-ga4]");
        processClickToProduct(ga4Div);
    });
        
    
    function trackPDP(){
    	if(!$(".product-primary-image").length || $("body").hasClass('trackpdp')){
    		return;
    	}
    	
    	$("body").addClass('trackpdp');
    	
    	var ga4 = $(".js-ga4-data-pdp").data('ga4');
        ga4.dimension37 = window.eStockRoomStoreID;
        ga4.dimension38 = window.eStockRoomEmployeeID;
        
        var breadcrumbds = [];
        $(".breadcrumb-element span").each(function(){
        	breadcrumbds.push($(this).text());
        });
        if(breadcrumbds.length){
       	 breadcrumbds = breadcrumbds.join(" / ").toLowerCase();
       	 ga4.list = breadcrumbds;
        }
        
        
        dataLayer.push({
            ecommerce: null
        });
        
        dataLayer.push({
            'event': 'productDetailView',
            'ecommerce': {
                'detail': {                    
                    'products': [ga4]
                }
            }
        });
        
        
        var objeGA4 = convertDataLaterProductToG4(ga4, "");
        
        window.dataLayer = window.dataLayer || [];
        
        window.dataLayer.push({
            event: 'view_item',
            currency: 'USD', 
            value: objeGA4.price, 
            ecommerce: {
                items: [objeGA4]
            }
        });
        
    }
    
    trackPDP();
    
    $(document).off('ga4addtocart');
    $(document).on('ga4addtocart', function(){
    	dataLayer.push({
    	    ecommerce: null
    	}); 
    	
    	var ga4 = $(".js-ga4-data-pdp").data('ga4');
        ga4.dimension37 = window.eStockRoomStoreID;
        ga4.dimension38 = window.eStockRoomEmployeeID;
        ga4.quantity = 1;
        
        var breadcrumbds = [];
        $(".breadcrumb-element span").each(function(){
        	breadcrumbds.push($(this).text());
        });
        if(breadcrumbds.length){
       	 breadcrumbds = breadcrumbds.join(" / ").toLowerCase();
       	 ga4.list = breadcrumbds;
        }
        
            	
    	dataLayer.push({
    	    'event': 'addToCart',
    	    'ecommerce': {
    	        'add': { 
    	            'products': [ga4]
    	        }
    	    }
    	});

    	var objeGA4 = convertDataLaterProductToG4(ga4, "");        
         
	    window.dataLayer = window.dataLayer || [];
	    window.dataLayer.push({
	    event: 'add_to_cart',
	    currency: 'USD',
	    value: objeGA4.price,
	    ecommerce: {
	        	items: [objeGA4]
	    	}
    	});
    });
    
    
    $(document).on('click', 'button[data-ga4-delete]', function(){
    	var ga4 = $(this).data("ga4-delete");    	
    	var quantity = parseInt($(this).data("quantity"));
    	
    	ga4.dimension37 = window.eStockRoomStoreID;
        ga4.dimension38 = window.eStockRoomEmployeeID;
        ga4.quantity = quantity;
        
    	// Measure the removal of a product from a shopping cart.
    	dataLayer.push({
    	    ecommerce: null
    	}); // Clear the previous ecommerce object.
    	
    	
    	dataLayer.push({
    	    'event': 'removeFromCart',
    	    'ecommerce': {
    	        'remove': { // 'remove' actionFieldObject measures.
    	            'products': [ga4]
    	        }
    	    }
    	});
    	
    
    	var objeGA4 = convertDataLaterProductToG4(ga4, "");
        
    	window.dataLayer = window.dataLayer || [];
    	window.dataLayer.push({
    	    event: 'remove_from_cart',
    	    currency: 'USD', // Currency of the item, in 3-letter ISO 4217 format.
    	    value: objeGA4.price, // price of product.
    	    ecommerce: {
    	        items: [objeGA4]
    	    }
    	});
    	
    	
    	    	
    });
    
    if(window.pageContext.ns == 'cart' && $("#cart-items-form").length){
    	var buttons = $("button[data-ga4-delete]");
		var products = [];
		var productsAnaliticsG4 = [];
		
         
		buttons.each(function(i, v){
			var ga4 = $(this).data("ga4-delete");
			ga4.dimension37 = window.eStockRoomStoreID;
	        ga4.dimension38 = window.eStockRoomEmployeeID;
	        ga4.quantity = parseInt($(this).data("quantity"));
	        
	        ga4.list = 'cart';       
	        
	        products.push(ga4);
	        productsAnaliticsG4.push(convertDataLaterProductToG4(ga4, ""));
		});
		
		dataLayer.push({
		        ecommerce: null
		}); // Clear the previous ecommerce object.
	    dataLayer.push({
	        'event': 'checkout',
	        'ecommerce': {
	            'checkout': {
	                'actionField': {
	                    'step': 1
	                },
	                'products': products
	            }
	        }
	    });
	    
	    
	    window.dataLayer = window.dataLayer || [];
	    window.dataLayer.push({
	        event: 'view_cart',
	        ecommerce: {
	            currency: 'USD', 
	            value: $(".js-order-total-f").data('totalvalue'), 
	            items: productsAnaliticsG4
	        }
	    }); 
    }
   
    
    $(".mini-cart-link-cart, .js-trigger-cart-action-checkout").on('click', function(){
    	dataLayer.push({ecommerce: null});
	    dataLayer.push({
	        'event': 'checkout',
	        'ecommerce': {
	            'checkout': {
	                'actionField': {
	                    'step': 2
	                },
	                'products': window.GA4ProductsGlobal
	            }
	        }
	    });
	    
	    window.dataLayer = window.dataLayer || [];
	    window.dataLayer.push({
	        event: 'begin_checkout',
	        ecommerce: {
	            currency: 'USD', 
	            value: $(".bfx-total-subtotal").data('totalvalue'), 
	            items: convertDataLaterProductToG4ArrayConvert(window.GA4ProductsGlobal)
	        }
	    });
    });
   
    
    $(document).on('click', '#shipping-submit-main', function(){
    	if($("form[id*='singleshipping_shippingAddress']").valid()){
	    	dataLayer.push({ecommerce: null});
		    dataLayer.push({
		        'event': 'checkout',
		        'ecommerce': {
		            'checkout': {
		                'actionField': {
		                    'step': 3
		                },
		                'products': window.GA4ProductsGlobal
		            }
		        }
		    });
		    
		    window.dataLayer = window.dataLayer || [];
		    window.dataLayer.push({
		        event: 'add_shipping_info',
		        ecommerce: {
		            currency: 'USD', 
		            value: $(".js-order-total-f").data('totalvalue'), 
		            items: convertDataLaterProductToG4ArrayConvert(window.GA4ProductsGlobal)
		        }
		    }); 
    	}
    });
    
    $(document).on('click', '#billing-submit-main', function(){
    	if($("form[id*='_billing']").valid()){
	    	dataLayer.push({ecommerce: null});
		    dataLayer.push({
		        'event': 'checkout',
		        'ecommerce': {
		            'checkout': {
		                'actionField': {
		                    'step': 4,
		                    'option' : $(".shipping-fullname").text().toLowerCase().indexOf('in store') > 0 ? 'in-store pickup' : 'ship to address'
		                },
		                'products': window.GA4ProductsGlobal
		            }
		        }
		    });
		    
		    window.dataLayer = window.dataLayer || [];
		    window.dataLayer.push({
		        event: 'add_payment_info',
		        ecommerce: {
		            currency: 'USD', 
		            value: $(".js-order-total-f").data('totalvalue'), 
		            payment_type: $("input[name='dwfrm_billing_paymentMethods_selectedPaymentMethodID']:checked").val(),
		            items: convertDataLaterProductToG4ArrayConvert(window.GA4ProductsGlobal)
		        }
		    }); 
    	}
    });
    
    if($(".order-summary-footer").length){
    	dataLayer.push({ecommerce: null});
	    dataLayer.push({
	        'event': 'checkout',
	        'ecommerce': {
	            'checkout': {
	                'actionField': {
	                    'step': 5,
	                    'option' : $(".js-paymentid-label").data('paymentid')
	                },
	                'products': window.GA4ProductsGlobal
	            }
	        }
	    });
	    
	    window.dataLayer = window.dataLayer || [];
	    window.dataLayer.push({
	        event: 'review_order',
	        ecommerce: {
	            currency: 'USD', 
	            value: $(".js-order-total-f").data('totalvalue'), 
	            items: convertDataLaterProductToG4ArrayConvert(window.GA4ProductsGlobal)
	        }
	    }); 
    }   
});