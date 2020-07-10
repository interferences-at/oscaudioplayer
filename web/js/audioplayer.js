function Audio() {
   this.$item = $(document.createElement('audio'));
   this.$item[0].volume = 0;
   $('body').append(this.$item);

   this.Play = function(name)
   {
    console.log('Play request: ' + name);
    this.$item.attr('src', name);
    this.$item[0].volume = 0;

    this.$item.on('canplay', function()
    {
      console.log('Playing: ' + this.$item[0].src);
        this.$item[0].volume = 1;
        this.$item[0].play();
        //this.$item.animate({volume: 1.0}, 1000);
        this.$item.off('canplay');
    }.bind(this))
   };

   this.Stop = function()
   {
        if(this.$item.is(':animated') || this.$item[0].readyState < 4)
        {
          console.log('Stopping: ' + this.$item[0].src);
          this.$item[0].pause();
          this.$item[0].volume = 0;
          this.$item.off('canplay');
          this.$item[0].src = '';
        }
        else
        {
          console.log('Stop request: ' + this.$item[0].src);

          setTimeout(function()
            {
              this.$item.animate({volume: 0.0}, 500, function() {
                console.log('Stop completed');
              });
            }.bind(this), 500);
          
        }

   };
}

var AudioPlayer = 
{
    items: [],
    currentItem: 0,
    Play: function(filename)
    {
        if(this.items.length == 0)
        {
            this.items[0] = new Audio();
            this.items[1] = new Audio();
        }

        this.items[this.currentItem].Stop();

        this.Next();

        this.items[this.currentItem].Play(filename);

    },

    Next: function()
    {
      this.currentItem += 1;
      if(this.currentItem >= this.items.length)
      {
        this.currentItem = 0;
      }
    },

    Stop: function()
    {
      if(this.items.length == 0)
      {
          this.items[0] = new Audio();
          this.items[1] = new Audio();
      }

      this.items[this.currentItem].Stop();
    }
};