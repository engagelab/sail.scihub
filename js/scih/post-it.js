(function($, $S) {
	// $jQuery
	// $S window.localStorage
	// Déclaration des variables
	var $board = $('#board'),
	// Placement des Post-It
	Postick, //Object Singleton contenant les fonctions pour travailler sur le LocalStorage
	len = 0,
	// Nombre d'objets dans le LocalStorage
	currentNotes = '',
	// Stockage du code HTML de l'élément Post-It
	o;
	// Données actuelles du Post-It dans le localStorage
	var $lastPostX = 20;
	var $lastPostY = 70;
	// Gérer les Post-It dans le LocalStorage
	// Chaque objet est enregistré dans le localStorage comme un Object
	Postick = {
		add : function(obj) {
			obj.id = $S.length;
			$S.setItem(obj.id, JSON.stringify(obj));
		},
		retrive : function(id) {
			return JSON.parse($S.getItem(id));
		},
		remove : function(id) {
			$S.removeItem(id);
		},
		removeAll : function() {
			$S.clear();
		}
	};

	// S'il existe des Post-It on les créer
	len = $S.length;
	if(len) {
		for(var i = 0; i < len; i++) {
			// Création de tous les Post-It se trouvant dans le localStorage
			var key = $S.key(i);
			o = Postick.retrive(key);
			currentNotes += '<div class="postick"';
			currentNotes += ' style="left:' + o.left;
			currentNotes += 'px; top:' + o.top;
			// L'attribut data-key permet de savoir quelle note on va supprimer dans le localStorage
			currentNotes += 'px"><div class="toolbar"><img src="images/drag.png" width="20px" /><button class="delete" value="' + key;
			currentNotes += '">Delete</button></div><div contenteditable="true" class="editable">';
			currentNotes += o.text;
			currentNotes += '</div></div>';
		}

		// Ajoute tous les Post-It sur le tableau de bord
		$board.html(currentNotes);
	}

	// Création du Post-It
	$('#btn-addNote').click(function() {
		$board.append('<div class="postick" style="left:'+$lastPostX+'px;top:'+$lastPostY+'px"><div class="toolbar"><img src="images/drag.png" width="20px" /><button class="delete">Delete</button></div><div contenteditable="true" class="editable"></div></div>');
		$(".postick").draggable({
			//containment : '#board',
			handle : '.toolbar'
		});

		$('.editable').blur(function() {
			alert('Save/update content to XMPP ...');
		});
		
		if ($lastPostX < 500) {
			$lastPostX = $lastPostX + 10;
			$lastPostY = $lastPostY + 10;
		}
		else {
			$lastPostX = 20;
			$lastPostY = 70;
		}
	});
	// Dès que le document est chargé, on rend tous les Post-It Draggable
	$(document).ready(function() {
		$(".postick").draggable({
			handle : '.toolbar',
			"zIndex" : 3000,
			"stack" : '.postick'
		});
	});
	// Suppression du Post-It
	$('button.delete').live('click', function() {
		if(confirm('Are you sure to delete this post-it?')) {
			var $this = $(this);
			// L'attribut value permet de savoir quelle note on va supprimer dans le localStorage
			Postick.remove($this.attr('value'));
			$this.closest('.postick').fadeOut('slow', function() {
				$(this).remove();
			});
		}
	});
	// Sauvegarde tous les Post-It lorsque l'utilisateur quitte la page
	window.onbeforeunload = function() {
		// Nettoyage du localStorage
		Postick.removeAll();
		// Puis on insère chaque Post-It dans le LocalStorage
		// Sauvegarde la position du Post-It, afin de le replacer lorsque la page est chargée à nouveau
		$('.postick').each(function() {
			var $this = $(this);
			Postick.add({
				top : parseInt($this.position().top),
				left : parseInt($this.position().left),
				text : $this.children('.editable').text()
			});
		});
	}
})(jQuery, window.localStorage);