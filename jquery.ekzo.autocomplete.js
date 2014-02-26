(function($){
    jQuery.fn.EkzoAutocomplete = function(options)
    {
        
        options = $.extend({
            searchType      :  'startWith',    //Тип поиска.
                                               //Допустимые значения: startWith, contains
            minCharsCount   :  0,              //Количество символов, с которого начинается поиск.
                                               //По умолчанию 0. Поиск начинается с первого символа.
            source          :  null,           //Источник вариантов. Массив строк или процедура, возвращающая такой массив
            highlightMatch  :  true,           //Выделять совпадения
            emptyText       :  'Search...',    //Текст пустого поля поиска
            ignoreCase      :  true,           //игнорировать регистор при проверке
            highlightOnError:  false           //Добавлять класс-индикатор при отсутствии совпадений с источником
            
        },options);
        
        var init = function(){
            //Метод инициализации плагина
            $(this)
                   .attr('autocomplete','off')
                   .addClass('ekzo-autocomplete')
                   .attr('placeholder',options.emptyText)
                   .data('highlightMatch',options.highlightMatch)
                   .data('search-type',options.searchType)
                   .data('source',options.source)
                   .data('ignoreCase',options.ignoreCase)
                   .data('minMatchCount',options.minCharsCount);
            
            $(this).on('keydown',function(e){keypressHandler(e);});
            $(this).on('input',function(){
                check(this);
            });
            $(this).on('focus',function(){
               check(this); 
            });
        }
        
        return this.each(init);
        
        function check(sender){
         //Вызываем обработчик  только при достижении минимального количества символов или при снятии ограницения
                if($(sender).data('minMatchCount')==0 || $(sender).data('minMatchCount')<=sender.val().length)
                    //checkSource(this);
                    drawNavigationList(sender,getMatches(sender));   
        }
        
        //Обработчик нажатий клавиш
        function keypressHandler(e){
            var sender = $(e.currentTarget);
            if(e.keyCode==38 | e.keyCode==40)
                navigateList(sender,e);
            if(e.keyCode == 13)
               enterKeyHandler(sender,e);
            if(e.keyCode == 27)
                removeNavigationList();
        }
        
        //Получаем список совпадений
        function getMatches(sender)
        {
            var values;
            if(typeof($(sender).data('source'))=="function")
                values =  $(sender).data('source')();
            else
                values =  $(sender).data('source');
            var currentValue = sender.value;
            var ignoreCase = $(sender).data('ignoreCase');
            var searchType = $(sender).data('search-type');
            var highLight = $(sender).data('highlightMatch');
            
            var suggestionsList = [];
            if(currentValue.length>0)
            for(i=0;i<values.length;i++)
                if(ignoreCase){
                    if(searchType=='startWith' && values[i].toLowerCase().startWith(currentValue.toLowerCase()))
                           if(!highLight)
                            suggestionsList.push(values[i]);
                           else 
                            suggestionsList.push(values[i].toLowerCase().replace(currentValue.toLowerCase(),'<span class="matchHighlight">'+currentValue+'</span>'));
                    else if (searchType=='contains' && values[i].toLowerCase().contains(currentValue.toLowerCase()))
                           if(!highLight)
                            suggestionsList.push(values[i]);
                           else 
                            suggestionsList.push(values[i].toLowerCase().replace(RegExp(currentValue.toLowerCase(),'g'),'<span class="matchHighlight">'+currentValue+'</span>'));
                }
                else{
                    if(searchType=='startWith' && values[i].startWith(currentValue)) 
                           if(!highLight)
                            suggestionsList.push(values[i]);
                           else 
                            suggestionsList.push(values[i].replace(RegExp(currentValue,'g'),'<span class="matchHighlight">'+currentValue+'</span>'));
                    else if (searchType=='contains' && values[i].contains(currentValue))
                           if(!highLight)
                            suggestionsList.push(values[i]);
                           else 
                            suggestionsList.push(values[i].replace(RegExp(currentValue,'g'),'<span class="matchHighlight">'+currentValue+'</span>'));
                }
                return suggestionsList;
        }
        
        //Навигация по списку вариантов по нажатию клавиш
        function navigateList(sender,e)
        {
            var list = $('.navigation-list');
            if(list.length==0){ return; }
            var currentItem = $('.navigationListItem .current');
            if(currentItem.length==0) currentItem = $('.navigationListItem').first();
  
            if(e.keyCode==38)
                moveNavigationUp();
            else if(e.keyCode==40)
                moveNavigationDown();
        }
        
        //Перемещение по списку вариантов вверх
        function moveNavigationUp()
        {
            var currentItemIndex = $('.navigationListItem.current').index();
            if(currentItemIndex == -1 | currentItemIndex == 0)
                currentItemIndex = $('.navigationListItem').length-1;
            else
                currentItemIndex--;
            $('.navigationListItem.current').removeClass('current');
            $($('.navigationListItem')[currentItemIndex]).addClass('current');
        }
        
        //Перемещение по списку вариантов вниз
        function moveNavigationDown()
        {
             var currentItemIndex = $('.navigationListItem.current').index();
            if(currentItemIndex == -1 | currentItemIndex == $('.navigationListItem').length-1)
                currentItemIndex = 0;
            else
                currentItemIndex++;
            $('.navigationListItem.current').removeClass('current');
            $($('.navigationListItem')[currentItemIndex]).addClass('current');
        }
        
        //Обработка нажатия клавиши Enter
        function enterKeyHandler(sender,e)
        {
            //Меняем значение на выбранное из списка
            applyListItemValue(sender);
            
            //отключаем отпавку формы по нажатию Enter, если поле вложено в форму
            if($(sender).closest('form').length!=0)
            {
                e.preventDefault();
                return false;   
            }
        }
        
        //Замена введенного значения на выбранное из списка
        function applyListItemValue(sender)
        {
         //Меняем значение на выбранное из списка
            if($('.navigation-list').length!=0 && $('.navigationListItem.current').length!=0)
            {
                $(sender).val($('.navigationListItem.current').text());
                removeNavigationList();
            }   
        }
        //Отрисовка списка вариантов
        function drawNavigationList(sender,items)
        {
            var list;
            if($('.navigation-list').length==0)
            {
                list = $('<ul></ul>').addClass('navigation-list');
                $('body').append(list);
                $(list).css('top',$(sender).offset().top+$(sender).height())
                       .css('left',$(sender).offset().left)
                       .css('min-width',$(sender).width());
            }
            else
            {
                list=$('.navigation-list');
                $(list).empty();    
            }
            //Если вариантов не предложено, удаляем список
            if(items.length==0){ 
                $(list).remove();
                //Добавляем класс-индикатор, обозначающий, что введена строка не соответствующая ни одному из вариантов
                if(options.highlightOnError && $(sender).val().length!=0)
                    $(sender).addClass('invalid-value');
            }
            else
                    $(sender).removeClass('invalid-value');
            
            //Наполняем список
            for(i=0;i<items.length;i++)
                $(list).append($('<li></li>').addClass('navigationListItem').html(items[i]));
            
            //Вешаем на каждый элемент событие клика и двойного клика
            $('.navigationListItem').on('click',function(){
                highlightClickedItem(this);
            }).on('dblclick',function(){
                applyListItemValue(sender);
            });
        }
        
        function highlightClickedItem(sender)
        {
            $('.navigationListItem').removeClass('current');
            $(sender).addClass('current');
        }
        
        function removeNavigationList()
        {
            if($(document).find('.navigation-list')!=undefined)
                $('.navigation-list').remove();
        }
        
    }
})(jQuery);

String.prototype.startWith=function(str)
{
    return this.indexOf(str)==0;
}
        
String.prototype.contains = function(str)
{
    return this.indexOf(str) != -1;   
}