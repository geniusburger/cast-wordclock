package us.geniusburger.android.wordclock;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.LinearLayout;
import android.widget.NumberPicker;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.TimePicker.OnTimeChangedListener;

public class MainActivity extends Activity {
	
	static final int DEFAULT_DELAY = 1000;
	
    TextView U1;
    TextView U2;
    TextView U3;
    TextView U4;
    TextView U5;
    TextView U6;
    TextView U7;
    TextView U8;
    TextView U9;
    TextView U10;
    TextView U11;
    TextView U12;
    
	TextView ITS;
    TextView THREEHOUR;
    TextView SIXHOUR;
    TextView ELEVENHOUR;
    TextView SEVENHOUR;
    TextView TENHOUR;
    TextView FIVEHOUR;
    TextView ONEHOUR;
    TextView NINEHOUR;
    TextView TWOHOUR;
    TextView EIGHTHOUR;
    TextView TWELVEHOUR;
    TextView FOURHOUR;
    TextView OCLOCK;
    TextView FIFTY;
    TextView THIRTY;
    TextView FORTY;
    TextView TWENTY;
    TextView OSEVEN;
    TextView SEVEN;
    TextView SEVENTEEN;
    TextView TWELVE;
    TextView OONE;
    TextView ONE;
    TextView ELEVEN;
    TextView OFOUR;
    TextView FOUR;
    TextView FOURTEEN;
    TextView OFIVE;
    TextView FIVE;
    TextView OSIX;
    TextView SIX;
    TextView SIXTEEN;
    TextView OEIGHT;
    TextView EIGHT;
    TextView EEN;
    TextView THIRTEEN;
    TextView FIFTEEN;
    TextView ONINE;
    TextView NINE;
    TextView TEEN;
    TextView OTWO;
    TextView TWO;
    TextView TEN;
    TextView OTHREE;
    TextView THREE;
    TextView IN;
    TextView AT;
    TextView THE;
    TextView MID;
    TextView NIGHT;
    TextView AFTER;
    TextView NOON;
    TextView MORNING;
    TextView THU;
    TextView SA;
    TextView T;
    TextView UE;
    TextView WED;
    TextView SUN;
    TextView FRI;
    TextView MON;
    TextView JAN;
    TextView FEB;
    TextView MAR;
    TextView APR;
    TextView MAY;
    TextView OCT;
    TextView JUL;
    TextView AUG;
    TextView SEP;
    TextView NOV;
    TextView JUN;
    TextView DEC;
    TextView D2TEN;
    TextView D1TEN;
    TextView D3TEN;
    TextView D2;
    TextView D5;
    TextView D8;
    TextView D3;
    TextView D4;
    TextView D0;
    TextView D6;
    TextView D9;
    TextView D1;
    TextView D7;
    
    LinearLayout textLayout;
    
    List<TextView> all;
    TextView preview;
    
    TimePicker timePicker;
    NumberPicker numberPicker;
    
    Calendar cal;
    
    MenuItem runItem;
    MenuItem stopItem;
    
    MyTask timeTask;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        U1 = (TextView)findViewById(R.id.textView_1);
        U2 = (TextView)findViewById(R.id.textView_2);
        U3 = (TextView)findViewById(R.id.textView_3);
        U4 = (TextView)findViewById(R.id.textView_4);
        U5 = (TextView)findViewById(R.id.textView_5);
        U6 = (TextView)findViewById(R.id.textView_6);
        U7 = (TextView)findViewById(R.id.textView_7);
        U8 = (TextView)findViewById(R.id.textView_8);
        U9 = (TextView)findViewById(R.id.textView_9);
        U10 = (TextView)findViewById(R.id.textView_10);
        U11 = (TextView)findViewById(R.id.textView_11);
        U12 = (TextView)findViewById(R.id.textView_12);
        
        ITS = (TextView)findViewById(R.id.textViewITS);
        THREEHOUR = (TextView)findViewById(R.id.textViewTHREEHOUR);
        SIXHOUR = (TextView)findViewById(R.id.textViewSIXHOUR);
        ELEVENHOUR = (TextView)findViewById(R.id.textViewELEVENHOUR);
        SEVENHOUR = (TextView)findViewById(R.id.textViewSEVENHOUR);
        TENHOUR = (TextView)findViewById(R.id.textViewTENHOUR);
        FIVEHOUR = (TextView)findViewById(R.id.textViewFIVEHOUR);
        ONEHOUR = (TextView)findViewById(R.id.textViewONEHOUR);
        NINEHOUR = (TextView)findViewById(R.id.textViewNINEHOUR);
        TWOHOUR = (TextView)findViewById(R.id.textViewTWOHOUR);
        EIGHTHOUR = (TextView)findViewById(R.id.textViewEIGHTHOUR);
        TWELVEHOUR = (TextView)findViewById(R.id.textViewTWELVEHOUR);
        FOURHOUR = (TextView)findViewById(R.id.textViewFOURHOUR);
        OCLOCK = (TextView)findViewById(R.id.textViewOCLOCK);
        FIFTY = (TextView)findViewById(R.id.textViewFIFTY);
        THIRTY = (TextView)findViewById(R.id.textViewTHIRTY);
        FORTY = (TextView)findViewById(R.id.textViewFORTY);
        TWENTY = (TextView)findViewById(R.id.textViewTWENTY);
        OSEVEN = (TextView)findViewById(R.id.textViewOSEVEN);
        SEVEN = (TextView)findViewById(R.id.textViewSEVEN);
        SEVENTEEN = (TextView)findViewById(R.id.textViewSEVENTEEN);
        TWELVE = (TextView)findViewById(R.id.textViewTWELVE);
        OONE = (TextView)findViewById(R.id.textViewOONE);
        ONE = (TextView)findViewById(R.id.textViewONE);
        ELEVEN = (TextView)findViewById(R.id.textViewELEVEN);
        OFOUR = (TextView)findViewById(R.id.textViewOFOUR);
        FOUR = (TextView)findViewById(R.id.textViewFOUR);
        FOURTEEN = (TextView)findViewById(R.id.textViewFOURTEEN);
        OFIVE = (TextView)findViewById(R.id.textViewOFIVE);
        FIVE = (TextView)findViewById(R.id.textViewFIVE);
        OSIX = (TextView)findViewById(R.id.textViewOSIX);
        SIX = (TextView)findViewById(R.id.textViewSIX);
        SIXTEEN = (TextView)findViewById(R.id.textViewSIXTEEN);
        OEIGHT = (TextView)findViewById(R.id.textViewOEIGHT);
        EIGHT = (TextView)findViewById(R.id.textViewEIGHT);
        EEN = (TextView)findViewById(R.id.textViewEEN);
        THIRTEEN = (TextView)findViewById(R.id.textViewTHIRTEEN);
        FIFTEEN = (TextView)findViewById(R.id.textViewFIFTEEN);
        ONINE = (TextView)findViewById(R.id.textViewONINE);
        NINE = (TextView)findViewById(R.id.textViewNINE);
        TEEN = (TextView)findViewById(R.id.textViewTEEN);
        OTWO = (TextView)findViewById(R.id.textViewOTWO);
        TWO = (TextView)findViewById(R.id.textViewTWO);
        TEN = (TextView)findViewById(R.id.textViewTEN);
        OTHREE = (TextView)findViewById(R.id.textViewO);
        THREE = (TextView)findViewById(R.id.textViewTHREE);
        IN = (TextView)findViewById(R.id.textViewIN);
        AT = (TextView)findViewById(R.id.textViewAT);
        THE = (TextView)findViewById(R.id.textViewTHE);
        MID = (TextView)findViewById(R.id.textViewMID);
        NIGHT = (TextView)findViewById(R.id.textViewNIGHT);
        AFTER = (TextView)findViewById(R.id.textViewAFTER);
        NOON = (TextView)findViewById(R.id.textViewNOON);
        MORNING = (TextView)findViewById(R.id.textViewMORNING);
        THU = (TextView)findViewById(R.id.textViewTHU);
        SA = (TextView)findViewById(R.id.textViewSA);
        T = (TextView)findViewById(R.id.textViewT);
        UE = (TextView)findViewById(R.id.textViewUE);
        WED = (TextView)findViewById(R.id.textViewWED);
        SUN = (TextView)findViewById(R.id.textViewSUN);
        FRI = (TextView)findViewById(R.id.textViewFRI);
        MON = (TextView)findViewById(R.id.textViewMON);
        JAN = (TextView)findViewById(R.id.textViewJAN);
        FEB = (TextView)findViewById(R.id.textViewFEB);
        MAR = (TextView)findViewById(R.id.textViewMAR);
        APR = (TextView)findViewById(R.id.textViewAPR);
        MAY = (TextView)findViewById(R.id.textViewMAY);
        OCT = (TextView)findViewById(R.id.textViewOCT);
        JUL = (TextView)findViewById(R.id.textViewJUL);
        AUG = (TextView)findViewById(R.id.textViewAUG);
        SEP = (TextView)findViewById(R.id.textViewSEP);
        NOV = (TextView)findViewById(R.id.textViewNOV);
        JUN = (TextView)findViewById(R.id.textViewJUN);
        DEC = (TextView)findViewById(R.id.textViewDEC);
        D2TEN = (TextView)findViewById(R.id.textView2TEN);
        D1TEN = (TextView)findViewById(R.id.textView1TEN);
        D3TEN = (TextView)findViewById(R.id.textView3TEN);
        D2 = (TextView)findViewById(R.id.textView2);
        D5 = (TextView)findViewById(R.id.textView5);
        D8 = (TextView)findViewById(R.id.textView8);
        D3 = (TextView)findViewById(R.id.textView3);
        D4 = (TextView)findViewById(R.id.textView4);
        D0 = (TextView)findViewById(R.id.textView0);
        D6 = (TextView)findViewById(R.id.textView6);
        D9 = (TextView)findViewById(R.id.textView9);
        D1 = (TextView)findViewById(R.id.textView1);
        D7 = (TextView)findViewById(R.id.textView7);
        
        all = new ArrayList<TextView>();
        textLayout = (LinearLayout)findViewById(R.id.linearLayout);
        int count = textLayout.getChildCount();
        for( int i = 0; i < count; i++) {
        	LinearLayout inner = (LinearLayout)textLayout.getChildAt(i);
        	int innerCount = inner.getChildCount();
        	for( int j = 0; j < innerCount; j++) {
        		all.add((TextView) inner.getChildAt(j));
        	}
        }
//        all = new TextView[]{
//        		U1, U2, U3, U4, U5, U6, U7, U8, U9, U10, U11, U12, ITS, THREEHOUR, SIXHOUR, ELEVENHOUR, SEVENHOUR, TENHOUR, FIVEHOUR, ONEHOUR, NINEHOUR, TWOHOUR, EIGHTHOUR, TWELVEHOUR, FOURHOUR, OCLOCK, FIFTY, THIRTY, FORTY, TWENTY, OSEVEN, SEVEN, SEVENTEEN, TWELVE, OONE, ONE, ELEVEN, OFOUR, FOUR, FOURTEEN, OFIVE, FIVE, OSIX, SIX, SIXTEEN, OEIGHT, EIGHT, EEN, THIRTEEN, FIFTEEN, ONINE, NINE, TEEN, OTWO, TWO, TEN, OTHREE, THREE, IN, AT, THE, MID, NIGHT, AFTER, NOON, MORNING, THU, SA, T, UE, WED, SUN, FRI, MON, JAN, FEB, MAR, APR, MAY, OCT, JUL, AUG, SEP, NOV, JUN, DEC, D2TEN, D1TEN, D3TEN, D2, D5, D8, D3, D4, D0, D6, D9, D1, D7
//        };
        preview = (TextView)findViewById(R.id.textViewPreview);
        clearAll();
        
        timePicker = (TimePicker) findViewById(R.id.timePicker1);
        cal = Calendar.getInstance();
        cal.setTime(new Date());
        timePicker.setCurrentHour(cal.get(Calendar.HOUR_OF_DAY));
        timePicker.setCurrentMinute(cal.get(Calendar.MINUTE));
        setDate(cal);
        timePicker.setOnTimeChangedListener(listener);
        
        numberPicker = (NumberPicker) findViewById(R.id.numberPicker1);        
        numberPicker.setMaxValue(60000);
        numberPicker.setMinValue(10);    
        numberPicker.setWrapSelectorWheel(false);
        numberPicker.setValue(DEFAULT_DELAY);
    }
    
    private void clearAll() {
    	for( TextView t : all) {
    		if( t == null) {
    			Log.e("TEST", "Failed");
    		} else {
    			t.setVisibility(TextView.INVISIBLE);
    		}
    	}
    }
    
    private class MyTask extends AsyncTask<Integer, Calendar, Calendar> {

		@Override
		protected Calendar doInBackground(Integer... params) {
			int hour = params[0].intValue();
			int minute = params[1].intValue();
			int delay = params[2].intValue();
			Calendar cal = Calendar.getInstance();
			cal.setTime(new Date());
			cal.set(Calendar.HOUR_OF_DAY, hour);
			cal.set(Calendar.MINUTE, minute);
			while(true) {
				if( this.isCancelled()) {
					break;
				}
				publishProgress(cal);
				if( delay > 0) {
					try {
						Thread.sleep(delay);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				cal.add(Calendar.MINUTE, 1);
			}
			return cal;
		}
		
		@Override
		protected void onProgressUpdate(Calendar... values) {
			timePicker.setCurrentHour(values[0].get(Calendar.HOUR_OF_DAY));
			timePicker.setCurrentMinute(values[0].get(Calendar.MINUTE));
			setDate(values[0]);
		}
		
		@Override
		protected void onPostExecute(Calendar result) {
			cal = result;
		}
    };
    
    private void on(TextView t) {
    	t.setVisibility(TextView.VISIBLE);
    }
    
    private void setDate(Calendar cal) {
    	int minute = cal.get(Calendar.MINUTE);
    	int hour = cal.get(Calendar.HOUR);
    	int ampm = cal.get(Calendar.AM_PM);
    	int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
    	int dayOfMonth = cal.get(Calendar.DAY_OF_MONTH);
    	int month = cal.get(Calendar.MONTH);

		clearAll();
		
    	on(ITS);
    	setTime(minute, hour, ampm);
    	setDayOfWeek(dayOfWeek);
    	setDayOfMonth(dayOfMonth);
    	setMonth(month);
    	
    	StringBuilder sb = new StringBuilder();
    	boolean last = true;
    	for( TextView t : all) {
    		if( t.getVisibility() == TextView.VISIBLE) {
	    		if( !last) {
	    			sb.append(" ");
	    		}
	    		last = true;
    			sb.append(t.getText());
    		} else {
    			last = false;
    		}
    	}
    	sb.deleteCharAt(sb.length()-2);	// Delete the extra space inserted for the day
    	preview.setText(sb.toString());
    }
    
    private void setTime(int minute, int hour, int ampm) {
    	
    	switch(hour) {
    	case 0:
    		on(TWELVEHOUR);
    		if( minute == 0) {
    			if( ampm == Calendar.AM) {
    				on(MID);
    				on(NIGHT);
    			} else {
    				on(NOON);
    			}
    			return;
    		}
    		break;
    	case 1:
    		on(ONEHOUR);
    		break;
    	case 2:
    		on(TWOHOUR);
    		break;
    	case 3:
    		on(THREEHOUR);
    		break;
    	case 4:
    		on(FOURHOUR);
    		break;
    	case 5:
    		on(FIVEHOUR);
    		break;
    	case 6:
    		on(SIXHOUR);
    		break;
    	case 7:
    		on(SEVENHOUR);
    		break;
    	case 8:
    		on(EIGHTHOUR);
    		break;
    	case 9:
    		on(NINEHOUR);
    		break;
    	case 10:
    		on(TENHOUR);
    		break;
    	case 11:
    		on(ELEVENHOUR);
    		break;
    	}
    	
    	if( ampm == Calendar.AM) {
    		on(IN);
    		on(THE);
    		on(MORNING);
    	} else {
    		if(hour < 5) {
    			on(IN);
    			on(THE);
    			on(AFTER);
    			on(NOON);
    		} else {
    			on(AT);
    			on(NIGHT);
    		}
    	}
    	
    	if( minute == 0) {
    		on(OCLOCK);
    	} else if (minute == 1) {
    		on(OONE);
    		on(ONE);
    	} else if (minute == 2) {
    		on(OTWO);
    		on(TWO);
    	} else if (minute == 3) {
    		on(OTHREE);
    		on(THREE);
    	} else if (minute == 4) {
    		on(OFOUR);
    		on(FOUR);
    	} else if (minute == 5) {
    		on(OFIVE);
    		on(FIVE);
    	} else if (minute == 6) {
    		on(OSIX);
    		on(SIX);
    	} else if (minute == 7) {
    		on(OSEVEN);
    		on(SEVEN);
    	} else if (minute == 8) {
    		on(OEIGHT);
    		on(EIGHT);
    	} else if (minute == 9) {
    		on(ONINE);
    		on(NINE);
    	} else if (minute == 10) {
    		on(TEN);
    	} else if (minute == 11) {
    		on(ELEVEN);
    	} else if (minute == 12) {
    		on(TWELVE);
    	} else if (minute == 13) {
    		on(THIRTEEN);
    	} else if (minute == 14) {
    		on(FOUR);
    		on(FOURTEEN);
    	} else if (minute == 15) {
    		on(FIFTEEN);
    	} else if (minute == 16) {
    		on(SIX);
    		on(SIXTEEN);
    	} else if (minute == 17) {
    		on(SEVEN);
    		on(SEVENTEEN);
    	} else if (minute == 18) {
    		on(EIGHT);
    		on(EEN);
    	} else if (minute == 19) {
    		on(NINE);
    		on(TEEN);
    	} else {
    		if( minute >= 50) {
    			on(FIFTY);
    		} else if (minute >= 40) {
    			on(FORTY);
    		} else if (minute >= 30) {
    			on(THIRTY);
    		} else {
    			on(TWENTY);
    		}
    		
    		switch(minute % 10) {
    		case 1:
    			on(ONE);
    			break;
    		case 2:
    			on(TWO);
    			break;
    		case 3:
    			on(THREE);
    			break;
    		case 4:
    			on(FOUR);
    			break;
    		case 5:
    			on(FIVE);
    			break;
    		case 6:
    			on(SIX);
    			break;
    		case 7:
    			on(SEVEN);
    			break;
    		case 8:
    			on(EIGHT);
    			break;
    		case 9:
    			on(NINE);
    			break;
    		}
    	}
    }
    
    private void setDayOfWeek(int day) {
    	switch(day) {
    	case Calendar.MONDAY:
    		on(MON);
    		break;
    	case Calendar.TUESDAY:
    		on(T);
    		on(UE);
    		break;
    	case Calendar.WEDNESDAY:
    		on(WED);
    		break;
    	case Calendar.THURSDAY:
    		on(THU);
    		break;
    	case Calendar.FRIDAY:
    		on(FRI);
    		break;
    	case Calendar.SATURDAY:
    		on(SA);
    		on(T);
    		break;
    	case Calendar.SUNDAY:
    		on(SUN);
    		break;
    	}
    }
    
    private void setDayOfMonth(int day) {
    	if( day >= 30) {
    		on(D3TEN);
    	} else if( day >= 20) {
    		on(D2TEN);
    	} else if( day >= 10) {
    		on(D1TEN);
    	}
    	
    	switch(day % 10) {
    	case 0:
    		on(D0);
    		break;
    	case 1:
    		on(D1);
    		break;
    	case 2:
    		on(D2);
    		break;
    	case 3:
    		on(D3);
    		break;
    	case 4:
    		on(D4);
    		break;
    	case 5:
    		on(D5);
    		break;
    	case 6:
    		on(D6);
    		break;
    	case 7:
    		on(D7);
    		break;
    	case 8:
    		on(D8);
    		break;
    	case 9:
    		on(D9);
    		break;
    	}
    }
    
    private void setMonth(int month) {
    	switch(month) {
    	case Calendar.JANUARY:
    		on(JAN);
    		break;
    	case Calendar.FEBRUARY:
    		on(FEB);
    		break;
    	case Calendar.MARCH:
    		on(MAR);
    		break;
    	case Calendar.APRIL:
    		on(APR);
    		break;
    	case Calendar.MAY:
    		on(MAY);
    		break;
    	case Calendar.JUNE:
    		on(JUN);
    		break;
    	case Calendar.JULY:
    		on(JUL);
    		break;
    	case Calendar.AUGUST:
    		on(AUG);
    		break;
    	case Calendar.SEPTEMBER:
    		on(SEP);
    		break;
    	case Calendar.OCTOBER:
    		on(OCT);
    		break;
    	case Calendar.NOVEMBER:
    		on(NOV);
    		break;
    	case Calendar.DECEMBER:
    		on(DEC);
    		break;
    	}
    }
    
    @Override
    protected void onDestroy() {
    	if( timeTask != null && !timeTask.isCancelled()) {
    		timeTask.cancel(false);
    		timeTask = null;
    	}
    	super.onDestroy();
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);        
        runItem = menu.findItem(R.id.action_run);
        stopItem = menu.findItem(R.id.action_stop);
        stopItem.setVisible(false);
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
    	switch(item.getItemId()) {
    	case R.id.action_run:
    		timePicker.setOnTimeChangedListener(null);
    		runItem.setVisible(false);
    		stopItem.setVisible(true);
    		timePicker.setEnabled(false);
    		numberPicker.setEnabled(false);
            timeTask = new MyTask();
            timeTask.execute(timePicker.getCurrentHour(), timePicker.getCurrentMinute(), numberPicker.getValue());
    		break;
    	case R.id.action_stop:
    		timePicker.setOnTimeChangedListener(listener);
    		timeTask.cancel(false);
    		timeTask = null;
    		runItem.setVisible(true);
    		stopItem.setVisible(false);
    		timePicker.setEnabled(true);
    		numberPicker.setEnabled(true);
    		break;
    		default:
    			return false;
    	}
		return true;
    }
    
    OnTimeChangedListener listener = new OnTimeChangedListener() {
		@Override
		public void onTimeChanged(TimePicker view, int hourOfDay, int minute) {
			int oldHour = cal.get(Calendar.HOUR_OF_DAY);
			if( oldHour == 23 && hourOfDay == 0) {
				cal.add(Calendar.DATE, 1);
			} else if (oldHour == 0 && hourOfDay == 23) {
				cal.add(Calendar.DATE, -1);
			}			
			cal.set(Calendar.HOUR_OF_DAY, hourOfDay);
			cal.set(Calendar.MINUTE, minute);
			setDate(cal);
		}
	};
}
